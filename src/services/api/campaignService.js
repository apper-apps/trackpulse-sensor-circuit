import campaignsData from '@/services/mockData/campaigns.json'

class CampaignService {
  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 350))
    return [...campaignsData]
  }

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200))
    const campaign = campaignsData.find(c => c.Id === parseInt(id))
    if (!campaign) {
      throw new Error('Campaign not found')
    }
    return { ...campaign }
  }

  async create(campaignData) {
    await new Promise(resolve => setTimeout(resolve, 450))
    const maxId = Math.max(...campaignsData.map(c => c.Id))
    const newCampaign = {
      Id: maxId + 1,
      ...campaignData,
      conversions: campaignData.conversions || 0,
      revenue: campaignData.revenue || 0,
      spend: campaignData.spend || 0,
      impressions: campaignData.impressions || 0,
      clicks: campaignData.clicks || 0,
      ctr: campaignData.ctr || 0
    }
    campaignsData.push(newCampaign)
    return { ...newCampaign }
  }

  async update(id, campaignData) {
    await new Promise(resolve => setTimeout(resolve, 300))
    const index = campaignsData.findIndex(c => c.Id === parseInt(id))
    if (index === -1) {
      throw new Error('Campaign not found')
    }
    campaignsData[index] = { ...campaignsData[index], ...campaignData }
    return { ...campaignsData[index] }
  }

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 250))
    const index = campaignsData.findIndex(c => c.Id === parseInt(id))
    if (index === -1) {
      throw new Error('Campaign not found')
    }
    const deletedCampaign = campaignsData.splice(index, 1)[0]
    return { ...deletedCampaign }
  }

  async getByChannel(channelId) {
    await new Promise(resolve => setTimeout(resolve, 300))
    return campaignsData.filter(c => c.channelId === parseInt(channelId)).map(c => ({ ...c }))
  }

  async getByStatus(status) {
    await new Promise(resolve => setTimeout(resolve, 250))
    return campaignsData.filter(c => c.status === status).map(c => ({ ...c }))
  }
}

export const campaignService = new CampaignService()