import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";

class APIService {
  private static instance: APIService;
  private axiosInstance: AxiosInstance;

  private constructor() {
    this.axiosInstance = axios.create({
      baseURL: "https://timestamp.fun/api",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });

    this.initializeInterceptors();
  }

  static getInstance(): APIService {
    if (!APIService.instance) {
      APIService.instance = new APIService();
    }
    return APIService.instance;
  }

  private initializeInterceptors(): void {
    this.axiosInstance.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem("accessToken");
        if (token) {
          config.headers["Authorization"] = `Bearer ${token}`;
        }
        config.headers["Token"] = import.meta.env.VITE_BOOTH_TOKEN;
        return config;
      },
      (error) => {
        return Promise.reject(error);
      },
    );

    this.axiosInstance.interceptors.response.use(
      (response: AxiosResponse) => {
        if (response.data) {
          response.data = response.data.data;
        }
        return response;
      },
      (error) => {
        if (error.response?.status === 401) {
          window.location.href = "/login";
        }
        return Promise.reject(error);
      },
    );
  }

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.axiosInstance.get<T>(url, config);
    return response.data;
  }

  async post<T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    const response = await this.axiosInstance.post<T>(url, data, config);
    return response.data;
  }

  async put<T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    const response = await this.axiosInstance.put<T>(url, data, config);
    return response.data;
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.axiosInstance.delete<T>(url, config);
    return response.data;
  }
}

export default APIService.getInstance();
