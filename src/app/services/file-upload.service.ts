import { Injectable } from '@angular/core';
import { Observable, firstValueFrom } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BlobServiceClient, BlockBlobClient, RestError } from '@azure/storage-blob';

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {

  constructor(private httpClient: HttpClient) { }

  async postFile(requestToken: RequestToken, fileToUpload: File): Promise<string> {
    const {url} = requestToken;
    const blockBlobClient = new BlockBlobClient(url);

    try{    
      const uploadBlobResponse = await blockBlobClient.uploadBrowserData(
      fileToUpload
      ); 
      return 'success!';
    } catch (error) {
      return (error as RestError).message;
    }
  }

  async getUploadToken(fileName: string, containerName = 'amaa-db-ben-images'): Promise<RequestToken> {
    const requestObservable = this.httpClient.post(
      'http://localhost:3000/blobs/upload-url', 
      { containerName,
        fileName},
       {headers: new HttpHeaders({'Content-Type': 'application/json'})});
    const requestToken = await firstValueFrom(requestObservable) as RequestToken;
    return requestToken;
  }

  async getUploadUrl(token: {blobName: string, containerName: string}): Promise<{sasUrl: string}> {
    const requestObservable = this.httpClient.post(
      'http://localhost:3000/blobs/download-url/', 
      token,
       {headers: new HttpHeaders({'Content-Type': 'application/json'})});
    const respUrl = await firstValueFrom(requestObservable) as {sasUrl: string};
    return respUrl;
  }
}

interface RequestToken {
  url: string;
  containerName: string;
  blobName: string;
}