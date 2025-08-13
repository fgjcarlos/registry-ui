export interface RegistryImage {
  name: string;
  tags: string[];
  lastModified?: string;
  size?: string;
}

export interface RegistryInfo {
  images: RegistryImage[];
  totalImages: number;
  registryUrl: string;
}

export class RegistryApiService {
  /**
   * Get all repositories from the registry
   */
  static async getRepositories(baseUrl: string, authToken: string, authType: 'basic' | 'bearer'): Promise<string[]> {
    const headers: Record<string, string> = {
      'Accept': 'application/json',
    };

    if (authType === 'basic') {
      headers['Authorization'] = `Basic ${authToken}`;
    } else {
      headers['Authorization'] = `Bearer ${authToken}`;
    }

    const response = await fetch(`${baseUrl}/v2/_catalog`, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch repositories: ${response.status}`);
    }

    const data = await response.json();
    return data.repositories || [];
  }

  /**
   * Get tags for a specific repository
   */
  static async getRepositoryTags(baseUrl: string, repositoryName: string, authToken: string, authType: 'basic' | 'bearer'): Promise<string[]> {
    const headers: Record<string, string> = {
      'Accept': 'application/json',
    };

    if (authType === 'basic') {
      headers['Authorization'] = `Basic ${authToken}`;
    } else {
      headers['Authorization'] = `Bearer ${authToken}`;
    }

    const response = await fetch(`${baseUrl}/v2/${repositoryName}/tags/list`, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch tags for ${repositoryName}: ${response.status}`);
    }

    const data = await response.json();
    return data.tags || [];
  }

  /**
   * Get all images with their tags from the registry
   */
  static async getAllImages(originalUrl: string, authToken: string, authType: 'basic' | 'bearer'): Promise<RegistryInfo> {
    try {
      // Use nginx proxy for localhost registry
      let baseUrl = originalUrl.replace(/\/+$/, '');
      if (baseUrl.includes('localhost:5000') || baseUrl.includes('127.0.0.1:5000')) {
        baseUrl = 'http://localhost:8080';
      }

      console.log('Fetching repositories from:', baseUrl);

      // Get all repositories
      const repositories = await this.getRepositories(baseUrl, authToken, authType);
      console.log('Found repositories:', repositories);

      if (repositories.length === 0) {
        return {
          images: [],
          totalImages: 0,
          registryUrl: originalUrl
        };
      }

      // Get tags for each repository
      const images: RegistryImage[] = [];
      for (const repo of repositories) {
        try {
          const tags = await this.getRepositoryTags(baseUrl, repo, authToken, authType);
          images.push({
            name: repo,
            tags: tags,
            lastModified: new Date().toISOString(), // Placeholder
            size: 'Unknown' // Placeholder
          });
        } catch (error) {
          console.warn(`Failed to get tags for ${repo}:`, error);
          images.push({
            name: repo,
            tags: [],
            lastModified: new Date().toISOString(),
            size: 'Unknown'
          });
        }
      }

      return {
        images,
        totalImages: images.length,
        registryUrl: originalUrl
      };

    } catch (error) {
      console.error('Failed to fetch registry images:', error);
      throw error;
    }
  }
}

/**
 * Fetches a paginated list of images from the Docker Registry v2 API.
 * @param registryUrl - The base URL of the Docker Registry.
 * @param page - The page number to fetch.
 * @param pageSize - The number of images per page.
 * @returns A promise resolving to the list of images and pagination info.
 */
export async function listImagesPaginated(page: number, pageSize: number) {
  const params = new URLSearchParams({
    page: page.toString(),
    pageSize: pageSize.toString(),
  });

  try {
    const response = await fetch(`/api/registry/images?${params.toString()}`, {
      method: 'GET',
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch images: ${response.statusText}`);
    }

    const data = await response.json();
    const nextPage = data.nextPage || null;

    console.log('Fetched images:', data);

    return {
      images: data.images,
      nextPage,
    };
  } catch (error) {
    console.error('Error fetching images:', error);
    throw new Error('Failed to fetch images from the Docker Registry.');
  }
}
