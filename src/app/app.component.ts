import { Component } from '@angular/core';
import { FileUploadService } from './services/file-upload.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  fileToUpload: File | null = null;
  loading = false;
  message = '';
  uploadedFile: any;
  imageUrl = 'https://thumbs.dreamstime.com/z/no-image-available-icon-flat-vector-no-image-available-icon-flat-vector-illustration-132482953.jpg';
  constructor(private readonly fileUploadService: FileUploadService){}

  handleFileInput(event: Event): void {
    const files = (<HTMLInputElement>event.target).files;
    if(files && files.length>0){
      this.fileToUpload = files.item(0); 
    }
    console.log(this.fileToUpload)
    
}

  async uploadFileToActivity() {
    this.message = '';
    if(this.fileToUpload){
      this.loading=true;
      const token = await this.fileUploadService.getUploadToken(this.fileToUpload.name)
      if(token){
        const status = await this.fileUploadService.postFile(token, this.fileToUpload)
        this.loading=false;
        this.message = status;
        this.uploadedFile = token;
        await this.getUploadedFile();
      }          
    }
  }

  async getUploadedFile(){
    if(this.uploadedFile){
      this.message = "Loading Uploaded image...";
      const sasToken = await this.fileUploadService.getUploadUrl(this.uploadedFile);
      this.imageUrl = sasToken.sasUrl;
      this.message = "Success!";
    }
  }
}
