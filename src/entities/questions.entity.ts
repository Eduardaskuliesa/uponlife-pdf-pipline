import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from "typeorm";
import { Book } from "./book.entity";

@Entity({ schema: "public", name: "question" })
export class Question extends BaseEntity {
  @PrimaryColumn({ type: "uuid", default: () => "gen_random_uuid()" })
  id!: string;

  @Column({ type: "timestamptz", default: () => "now()" })
  created_at!: Date;

  @Column({ type: "text", nullable: true })
  question?: string;

  @Column({ type: "bigint", nullable: true })
  sequence?: number;

  @Column({ type: "boolean", default: false })
  answered!: boolean;

  @Column({ type: "bigint", default: 0 })
  pages_count!: number;

  @Column({ type: "uuid", nullable: true })
  book_id?: string;

  @ManyToOne(() => Book, { onDelete: "CASCADE" })
  @JoinColumn({ name: "book_id" })
  book?: Book;

  @Column({ type: "boolean", default: false })
  is_manually_created!: boolean;

  @Column({ type: "text", nullable: true })
  summary?: string;

  @Column({ type: "timestamptz", default: () => "now()" })
  last_modified_at?: Date;
}
