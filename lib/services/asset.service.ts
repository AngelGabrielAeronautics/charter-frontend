import { GetProp, UploadFile, UploadProps } from "antd";
import axios from "axios";

import { eModules } from "@/lib/enums/modules.enums";
import { IAsset as IRecord } from "@/lib/models/IAssets";
import BaseService from "@/lib/services/base.service";

type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

export default class AssetService extends BaseService {
  constructor(subject: eModules) {
    super(subject);
  }

  url = `${this.baseUrl}/${this.subject}`;

  create = async ({
    payload,
    images,
  }: {
    payload: IRecord;
    images: UploadFile[];
  }) => {
    const createResponse = await axios.post(this.url, payload, {
      headers: this.headers,
    });

    let responseData = await createResponse.data;

    if (createResponse.status != 201)
      throw new Error(createResponse.data.message);

    for (let index = 0; index < images.length; index++) {
      const formData = new FormData();
      const file = images[index];
      formData.append("file", file.originFileObj as FileType);

      fetch(`${this.url}/upload/images/${createResponse.data._id}`, {
        method: "POST",
        body: formData,
      })
        .then((res) => res.json())
        .then((data) => {
          responseData = data;
        })
        .catch(() => {});
    }

    return responseData;
  };

  findAll = async () => {
    const response = await axios.get(this.url, {
      headers: this.headers,
    });

    return response.data;
  };

  findOne = async (id: string) => {
    const response = await axios.get(`${this.url}/${id}`, {
      headers: this.headers,
    });

    return response.data;
  };

  findByFilter = async (payload: any) => {
    const response = await axios.post(`${this.url}/filter`, payload, {
      headers: this.headers,
    });

    return response.data;
  };

  update = async (id: string, payload: IRecord) => {
    const response = await axios.patch(`${this.url}/${id}`, payload, {
      headers: this.headers,
    });

    return response.data;
  };

  remove = async (id: string) => {
    const response = await axios.delete(`${this.url}/${id}`, {
      headers: this.headers,
    });

    return response.data;
  };
}
