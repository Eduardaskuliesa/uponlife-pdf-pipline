import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryColumn,
} from "typeorm";
import { Question } from "./questions.entity";
import { File } from "./file.entity";
import { SectionType } from "../enums/section.enum";
import { Block } from "../types/block";

@Entity({ schema: "public", name: "section" })
export class Section extends BaseEntity {
  @PrimaryColumn({ type: "uuid", default: () => "gen_random_uuid()" })
  id!: string;

  @Column({ type: "timestamptz", default: () => "now()" })
  created_at!: Date;

  @Column({ type: "json", nullable: true })
  content?: Block;

  @Column({
    type: "enum",
    enum: SectionType,
    enumName: "section_type",
    nullable: true,
  })
  type?: SectionType;

  @Column({ type: "uuid" })
  question_id!: string;

  @ManyToOne(() => Question, { onDelete: "CASCADE" })
  @JoinColumn({ name: "question_id" })
  question!: Question;

  @Column({ type: "bigint", nullable: true })
  sequence?: number;

  @Column({ type: "uuid", nullable: true })
  file_id?: string;

  @OneToOne(() => File, { onDelete: "CASCADE" })
  @JoinColumn({ name: "file_id" })
  file?: File;

  @Column({ type: "text", nullable: true })
  block_id?: string;
}
