import { AxiosResponse, AxiosError } from 'axios';
import { Observable } from 'rxjs';

export async function doRequest<T>(cb: Observable<AxiosResponse<T>>): Promise<T> {
  try {
    const { data } = await cb.toPromise();
    return data;
  } catch (err) {
    if (err.isAxiosError) {
      console.log('ERROR!', err);
      const e: AxiosError = err;
      throw e.response.data;
    }

    throw err;
  }
}
