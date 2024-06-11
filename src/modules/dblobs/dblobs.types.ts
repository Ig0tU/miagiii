import { v4 as uuidv4 } from 'uuid';

// Blob

enum DBlobMimeType {
  IMG_PNG = 'image/png',
  IMG_JPEG = 'image/jpeg',
  AUDIO_MPEG = 'audio/mpeg',
  AUDIO_WAV = 'audio/wav',
}

interface DBlobData<M extends DBlobMimeType> {
  mimeType: M;
  base64: string;
  size?: number;
  altMimeType?: DBlobMimeType;
  altData?: string;
}

// Item Origin

interface UploadOrigin {
  origin: 'upload';
  dir: 'out';
  source: string;
  fileName: string;
  fileSize?: number;
  fileType?: string;
  attachmentMessageId?: string;
}

interface GeneratedOrigin {
  origin: 'generated';
  dir: 'in';
  source: string;
  generatorName: string;
  parameters: { [key: string]: any };
  generatedAt?: string;
}

type ItemDataOrigin = UploadOrigin | GeneratedOrigin;

// Item Base type

interface DBlobBase<TType extends DBlobMetaDataType, TMime extends DBlobMimeType, TMeta extends Record<string, any>> {
  id: string;
  type: TType;
  label: string;
  data: DBlobData<TMime>;
  origin: ItemDataOrigin;
  createdAt: Date;
  updatedAt: Date;
  metadata: TMeta;
  cache: Record<string, DBlobData<DBlobMimeType>>;
}

export function createDBlobBase<TType extends DBlobMetaDataType, TMime extends DBlobMimeType, TMeta extends Record<string, any>>(type: TType, label: string, data: DBlobData<TMime>, origin: ItemDataOrigin, metadata: TMeta): DBlobBase<TType, TMime, TMeta> {
  return {
    id: uuidv4(),
    type,
    label,
    data,
    origin,
    createdAt: new Date(),
    updatedAt: new Date(),
    metadata,
    cache: {},
  };
}

// Item Specialization

export enum DBlobMetaDataType {
  IMAGE = 'image',
  AUDIO = 'audio',
}

interface ImageMetadata {
  width: number;
  height: number;
  averageColor?: string;
  author?: string;
  tags?: string[];
  description?: string;
}

interface AudioMetadata {
  duration: number;
  sampleRate: number;
  bitrate?: number;
  channels?: number;
}

export type DBlobImageItem = DBlobBase<DBlobMetaDataType.IMAGE, DBlobMimeType.IMG_PNG | DBlobMimeType.IMG_JPEG, ImageMetadata>;
export type DBlobAudioItem = DBlobBase<DBlobMetaDataType.AUDIO, DBlobMimeType.AUDIO_MPEG | DBlobMimeType.AUDIO_WAV, AudioMetadata>;

// DB Item Data

export type DBlobItem = DBlobImageItem | DBlobAudioItem;

export function createDBlobImageItem(label: string, data: DBlobImageItem['data'], origin: ItemDataOrigin, metadata: ImageMetadata): DBlobImageItem {
  return createDBlobBase(DBlobMetaDataType.IMAGE, label, data, origin, metadata);
}

export type DBlobDBItem = DBlobItem & {
  uId: '1';
  wId: '1';
  cId: 'global';
}
