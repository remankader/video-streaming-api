import { VIDEO_STATUS_INACTIVE } from "../shared/constants/video";
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from "typeorm";

@Entity()
export class Video {
  @PrimaryGeneratedColumn({ type: "int" })
  id: number;

  @Column({
    unique: true,
    length: 200,
  })
  name: string;

  @Column({
    length: 100,
  })
  format: string;

  @Column({
    type: "float",
  })
  duration: number;

  @Column({
    name: "frame_rate",
    type: "float",
  })
  frameRate: number;

  @Column({
    name: "width",
  })
  width: number;

  @Column({
    name: "height",
  })
  height: number;

  @Column({
    length: 200,
  })
  title: string;

  @Column({
    default: null,
  })
  category: string;

  @Column({
    length: 1000,
    default: null,
  })
  about: string;

  @Column({
    name: "process_status",
    type: "float",
    default: null,
  })
  processStatus: number;

  @Index()
  @Column({
    name: "status_id",
    default: VIDEO_STATUS_INACTIVE,
  })
  statusId: number;

  @CreateDateColumn({
    name: "created_at",
    type: "timestamptz",
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: "updated_at",
    type: "timestamptz",
  })
  updatedAt: Date;
}
