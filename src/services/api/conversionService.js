import conversionsData from '@/services/mockData/conversions.json'

class ConversionService {
  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 400))
    return [...conversionsData]
  }

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200))
    const conversion = conversionsData.find(c => c.Id === parseInt(id))
    if (!conversion) {
      throw new Error('Conversion not found')
    }
    return { ...conversion }
  }

  async create(conversionData) {
    await new Promise(resolve => setTimeout(resolve, 500))
    const maxId = Math.max(...conversionsData.map(c => c.Id))
    const newConversion = {
      Id: maxId + 1,
      ...conversionData,
      timestamp: conversionData.timestamp || new Date().toISOString(),
      touchpoints: conversionData.touchpoints || []
    }
    conversionsData.push(newConversion)
    return { ...newConversion }
  }

  async update(id, conversionData) {
    await new Promise(resolve => setTimeout(resolve, 350))
    const index = conversionsData.findIndex(c => c.Id === parseInt(id))
    if (index === -1) {
      throw new Error('Conversion not found')
    }
    conversionsData[index] = { ...conversionsData[index], ...conversionData }
    return { ...conversionsData[index] }
  }

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 250))
    const index = conversionsData.findIndex(c => c.Id === parseInt(id))
    if (index === -1) {
      throw new Error('Conversion not found')
    }
    const deletedConversion = conversionsData.splice(index, 1)[0]
    return { ...deletedConversion }
  }

  async getByCustomer(customerId) {
    await new Promise(resolve => setTimeout(resolve, 300))
    return conversionsData.filter(c => c.customerId === customerId).map(c => ({ ...c }))
  }

  async getByDateRange(startDate, endDate) {
    await new Promise(resolve => setTimeout(resolve, 350))
    const start = new Date(startDate)
    const end = new Date(endDate)
    return conversionsData.filter(c => {
      const conversionDate = new Date(c.timestamp)
      return conversionDate >= start && conversionDate <= end
    }).map(c => ({ ...c }))
  }

  async getByChannel(channelId) {
    await new Promise(resolve => setTimeout(resolve, 300))
    return conversionsData.filter(c => 
      c.touchpoints && c.touchpoints.some(tp => tp.channelId === parseInt(channelId))
    ).map(c => ({ ...c }))
  }
}

export const conversionService = new ConversionService()