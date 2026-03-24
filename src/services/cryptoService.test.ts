import { beforeEach, describe, expect, it, vi } from 'vitest'

const { mockGet, mockCreate, mockIsAxiosError } = vi.hoisted(() => {
  const hoistedMockGet = vi.fn()
  const hoistedMockCreate = vi.fn(() => ({ get: hoistedMockGet }))
  const hoistedMockIsAxiosError = vi.fn((error: unknown) =>
    Boolean((error as { isAxiosError?: boolean })?.isAxiosError)
  )

  return {
    mockGet: hoistedMockGet,
    mockCreate: hoistedMockCreate,
    mockIsAxiosError: hoistedMockIsAxiosError,
  }
})

vi.mock('axios', () => ({
  default: {
    create: mockCreate,
    isAxiosError: mockIsAxiosError,
  },
  create: mockCreate,
  isAxiosError: mockIsAxiosError,
}))

import cryptoService from './cryptoService'

describe('cryptoService', () => {
  beforeEach(() => {
    mockGet.mockReset()
    mockCreate.mockClear()
    mockIsAxiosError.mockClear()
    cryptoService.clearCache()
  })

  it('caches top cryptocurrencies per currency and limit', async () => {
    const apiPayload = [{ id: 'bitcoin', current_price: 1 }]
    mockGet.mockResolvedValue({ data: apiPayload })

    const first = await cryptoService.getTopCryptocurrencies(10, 'zar')
    const second = await cryptoService.getTopCryptocurrencies(10, 'zar')

    expect(first).toEqual(apiPayload)
    expect(second).toEqual(apiPayload)
    expect(mockGet).toHaveBeenCalledTimes(1)
  })

  it('filters historical points to requested time range', async () => {
    const fixedNowMs = 1_700_000_000_000
    const fixedNowSec = Math.floor(fixedNowMs / 1000)
    const fromSec = fixedNowSec - 30 * 24 * 60 * 60

    const outsidePoint = (fromSec - 10) * 1000
    const insidePoint = (fromSec + 100) * 1000

    const nowSpy = vi.spyOn(Date, 'now').mockReturnValue(fixedNowMs)

    mockGet.mockResolvedValue({
      data: {
        prices: [
          [outsidePoint, 1],
          [insidePoint, 2],
        ],
        market_caps: [
          [outsidePoint, 10],
          [insidePoint, 20],
        ],
        total_volumes: [
          [outsidePoint, 100],
          [insidePoint, 200],
        ],
      },
    })

    const result = await cryptoService.getHistoricalPrices('bitcoin', 30, 'zar', true)

    expect(result).toHaveLength(1)
    expect(result[0]).toEqual({
      timestamp: insidePoint,
      price: 2,
      marketCap: 20,
      totalVolume: 200,
    })

    nowSpy.mockRestore()
  })

  it('bypasses cache when forceRefresh is true', async () => {
    const fixedNowMs = 1_700_000_000_000
    const fixedNowSec = Math.floor(fixedNowMs / 1000)
    const fromSec = fixedNowSec - 7 * 24 * 60 * 60
    const firstTs = (fromSec + 120) * 1000
    const secondTs = (fromSec + 240) * 1000

    const nowSpy = vi.spyOn(Date, 'now').mockReturnValue(fixedNowMs)

    const firstPayload = {
      data: {
        prices: [[firstTs, 10]],
        market_caps: [[firstTs, 100]],
        total_volumes: [[firstTs, 1_000]],
      },
    }

    const secondPayload = {
      data: {
        prices: [[secondTs, 20]],
        market_caps: [[secondTs, 200]],
        total_volumes: [[secondTs, 2_000]],
      },
    }

    mockGet
      .mockResolvedValueOnce(firstPayload)
      .mockResolvedValueOnce(secondPayload)

    const first = await cryptoService.getHistoricalPrices('bitcoin', 7, 'zar', false)
    const second = await cryptoService.getHistoricalPrices('bitcoin', 7, 'zar', true)

    expect(first[0].price).toBe(10)
    expect(second[0].price).toBe(20)
    expect(mockGet).toHaveBeenCalledTimes(2)

    nowSpy.mockRestore()
  })
})
