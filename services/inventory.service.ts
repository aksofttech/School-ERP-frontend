import { apiClient } from '@/utils/api-client';
import { API_ENDPOINTS } from '@/utils/constants';

class InventoryService {
    async getItems() {
        const response = await apiClient.get(`${API_ENDPOINTS.INVENTORY}/items`);
        return response.data!;
    }

    async createItem(data: any) {
        const response = await apiClient.post(`${API_ENDPOINTS.INVENTORY}/items`, data);
        return response.data;
    }

    async getCategories() {
        const response = await apiClient.get(`${API_ENDPOINTS.INVENTORY}/categories`);
        return response.data!;
    }

    async issueItem(data: any) {
        const response = await apiClient.post(`${API_ENDPOINTS.INVENTORY}/issue`, data);
        return response.data;
    }

    async getIssuanceHistory() {
        const response = await apiClient.get(`${API_ENDPOINTS.INVENTORY}/history`);
        return response.data!;
    }
}

export const inventoryService = new InventoryService();
