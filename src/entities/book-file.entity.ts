import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from "typeorm";
import { Book } from "./book.entity";
import { BookFileType, BookFileState } from "../enums/book.enum";

@Entity({ schema: "public", name: "book_file" })
export class BookFile extends BaseEntity {
  @PrimaryColumn({ type: "uuid", default: () => "gen_random_uuid()" })
  id!: string;

  @Column({ type: "timestamptz", default: () => "now()" })
  created_at!: Date;

  @Column({ type: "uuid", nullable: true })
  book_id?: string;

  @ManyToOne(() => Book, { onDelete: "CASCADE" })
  @JoinColumn({ name: "book_id" })
  book?: Book;

  @Column({ type: "text", nullable: true })
  file_id?: string | null;

  @Column({
    type: "enum",
    enum: BookFileType,
    enumName: "book_file_type",
    nullable: false,
  })
  type!: BookFileType;

  @Column({
    type: "enum",
    enum: BookFileState,
    enumName: "book_file_state",
    nullable: false,
  })
  state!: BookFileState;

  @Column({ type: "boolean", default: false })
  is_stale!: boolean;

  @Column({ type: "timestamptz", nullable: true })
  generation_started?: Date;
}
