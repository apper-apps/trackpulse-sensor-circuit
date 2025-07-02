import channelsData from '@/services/mockData/channels.json'

class ChannelService {
  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 300))
    return [...channelsData]
  }

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200))
    const channel = channelsData.find(c => c.Id === parseInt(id))
    if (!channel) {
      throw new Error('Channel not found')
    }
    return { ...channel }
  }

  async create(channelData) {
    await new Promise(resolve => setTimeout(resolve, 400))
    const maxId = Math.max(...channelsData.map(c => c.Id))
    const newChannel = {
      Id: maxId + 1,
      ...channelData,
      spend: channelData.spend || 0,
      conversions: channelData.conversions || 0,
      revenue: channelData.revenue || 0,
      roas: channelData.roas || 0
    }
    channelsData.push(newChannel)
    return { ...newChannel }
  }

  async update(id, channelData) {
    await new Promise(resolve => setTimeout(resolve, 300))
    const index = channelsData.findIndex(c => c.Id === parseInt(id))
    if (index === -1) {
      throw new Error('Channel not found')
    }
    channelsData[index] = { ...channelsData[index], ...channelData }
    return { ...channelsData[index] }
  }

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 250))
    const index = channelsData.findIndex(c => c.Id === parseInt(id))
    if (index === -1) {
      throw new Error('Channel not found')
    }
    const deletedChannel = channelsData.splice(index, 1)[0]
    return { ...deletedChannel }
  }
}

export const channelService = new ChannelService()