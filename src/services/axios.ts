import getToken from "@/token";
import { HttpCodeConfig, type ResponseModel, type UploadFileItemModel, type UploadRequestConfig } from "@/types";
import axios, { AxiosError, type AxiosInstance, type AxiosRequestConfig, type AxiosResponse, type InternalAxiosRequestConfig } from "axios";

class HttpRequest {

  service: AxiosInstance;
  constructor() {
    this.service = axios.create({
      baseURL: import.meta.env.VITE_API_BASE_URL,
      timeout: import.meta.env.VITE_TIMEOUT,
      headers: {
        "Content-Type": "application/json"
      }
    })
    this.service.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        // onFulfilled: 在请求发送前执行, 接受一个 config 对象并返回处理后的新 config对象，一般在里面配置token等
        if (import.meta.env.VITE_APP_TOKEN_KEY && getToken()) {
          config.headers[import.meta.env.VITE_APP_TOKEN_KEY] = getToken()
        }
        return config
      },
      (error: AxiosError) => {
        // onRejected: onFulfilled 执行发生错误后执行，接收错误对象，一般我们请求没发送出去出现报错时，执行的就是这一步
        console.log("requestError: ", error);
        return Promise.reject(error);
      },
      {
        /**
         * options：其他配置参数，接收两个参数, 均是可传项，以后的进阶功能封装里可能会使用到
         * synchronous: 是否同步
         * runWhen: 接收一个类型为InternalAxiosRequestConfig的 config 参数，返回一个 boolean。
         *          触发时机为每次请求触发拦截器之前，当 runWhen返回 true, 则执行作用在本次请求上的拦截器方法, 否则不执行
        */
        synchronous: false,
        runWhen: ((config: InternalAxiosRequestConfig) => {
          // do something
          // if return true, axios will execution interceptor method
          return true
        })
      }
    );
    this.service.interceptors.response.use(
      (response: AxiosResponse<ResponseModel>): AxiosResponse['data'] => {
        const { data } = response;
        const { code } = data;
        if (code) {
          if (code != HttpCodeConfig.success) {
            switch (code) {
              case HttpCodeConfig.notFound:
                console.log('url not found')
                break;
              case HttpCodeConfig.noPermission:
                console.log('no permission');
                break;
              default:
                console.log('other error:', code);
                break;
            }
            return Promise.reject(data.message);
          } else {
            return data;
          }
        } else {
          return Promise.reject('Error! code missing');
        }
      },
      (error: any) => {
        return Promise.reject(error)
      }
    );
  }
  request<T = any>(config: AxiosRequestConfig): Promise<ResponseModel<T>> {
    return new Promise((resolve, reject) => {
      try {
        this.service.request<ResponseModel<T>>(config).then((res: AxiosResponse['data']) => {
          resolve(res as ResponseModel<T>);
        }).catch((err) => {
          reject(err);
        })
      } catch (err) {
        reject(err);
      }
    });
  }
  get<T = any>(config: AxiosRequestConfig): Promise<ResponseModel<T>> {
    return this.request({ method: 'GET', ...config });
  }
  post<T = any>(config: AxiosRequestConfig): Promise<ResponseModel<T>> {
    return this.request({ method: 'POST', ...config });
  }
  put<T = any>(config: AxiosRequestConfig): Promise<ResponseModel<T>> {
    return this.request({ method: 'PUT', ...config })
  }
  delete<T = any>(config: AxiosRequestConfig): Promise<ResponseModel<T>> {
    return this.request({ method: 'DELETE', ...config })
  }
  upload<T = string>(fileItem: UploadFileItemModel, config?: UploadRequestConfig): Promise<ResponseModel<T>> | null {
    if (!import.meta.env.VITE_UPLOAD_URL) return null

    let fd = new FormData()
    fd.append(fileItem.name, fileItem.value)
    let configCopy: UploadRequestConfig
    if (!config) {
      configCopy = {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    } else {
      config.headers!['Content-Type'] = 'multipart/form-data'
      configCopy = config
    }
    return this.request({ url: import.meta.env.VITE_UPLOAD_URL, data: fd, ...configCopy })
  }

}

const httpRequest = new HttpRequest();
export default httpRequest;