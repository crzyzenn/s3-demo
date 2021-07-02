import AWS from 'aws-sdk'
import React, { useState } from 'react'


const S3_BUCKET = 'dw-demo-app123'
const REGION = 'ap-south-1'

AWS.config.update({
  accessKeyId: 'AKIAQBAPHKK5ZFM5IZMY',
  secretAccessKey: '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'
})

const myBucket = new AWS.S3({
  params: {Bucket: S3_BUCKET},
  region: REGION
})

export default function UploadImage() {
  const [file, setFile] = useState()
  const [loading, setLoading] = useState(false)
  const [src, setSrc] = useState('')

  const handleFileInput = (e) => {
    setFile(e.target.files[0])
  }

  const handleFileUpload = () => {
    setLoading(true)
    console.log(file)
    const params = {
      ACL: 'public-read',
      Body: file,
      Bucket: S3_BUCKET,
      Key: file.name
    }

    // mimeType.....
    // .... if don't want to upload...restrict here by checking mimetype....
    // image/png, image/jpg....

    myBucket.putObject(params).on('success', () => {
      // https://dw-demo-app123.s3.ap-south-1.amazonaws.com/logitech.jpeg
      // Generate URL for preview...
      const imageSrc = `https://${S3_BUCKET}.s3.${REGION}.amazonaws.com/${file.name}`
      setSrc(imageSrc)
      setLoading(false)
    }).send(err => {
      if(err) console.log(err)
      setLoading(false)
    })
  }

  return (
    <div>
      <h1>AWS S3 File Upload Demo..</h1>
      <input type="file" onChange={handleFileInput} />
      <button onClick={handleFileUpload}>Upload file.</button>
      {loading && 'File uploading....'}
      <img src={src} width="100%" />
    </div>
  )
}
