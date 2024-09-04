import { TJsonaModel } from 'jsona/lib/JsonaTypes';
import { Category, Keyword, MediaFile, MediaImage } from './types';

export const mapCategory = (data: TJsonaModel) => {
  const category: Category = {
    id: data.id,
    type: data.type,
    name: data.name,
    status: data.status,
  };
  return category;
};

export const mapKeyword = (data: TJsonaModel) => {
  const keyword: Keyword = {
    id: data.id,
    type: data.type,
    name: data.name,
    status: data.status,
  };
  return keyword;
};

export const mapFile = (data: TJsonaModel) => {
  const file: MediaFile = {
    id: data.id,
    type: data.type,
    fileName: data.filename,
    fileMime: data.filemime,
    fileSize: data.filesize,
    url: data.image_style_uri?.medium || null,
    alt: data.resourceIdObjMeta?.alt || null,
    editUrl: `/media/${data.resourceIdObjMeta?.drupal_internal__target_id}/edit?destination=/admin/assets/all-unpublished`,
  };
  return file;
};

export const mapMediaImage = (data: TJsonaModel) => {
  const mediaImg: MediaImage = {
    id: data.id,
    type: data.type,
    status: data.status,
    name: data.name,
    categories: data.field_category?.length
      ? data.field_category.map(mapCategory)
      : null,
    keywords: data.field_keywords?.length
      ? data.field_keywords.map(mapKeyword)
      : null,
    file: mapFile(data.field_image),
  };
  return mediaImg;
};
