import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  Unique,
} from "typeorm";
import { User } from "./user.entity";
import { Book } from "./book.entity";

@Entity({ schema: "public", name: "book_editor" })
@Unique(["user_id", "book_id"]) // user can be editor of a book only once
export class BookEditor extends BaseEntity {
  @PrimaryColumn({ type: "uuid", default: () => "gen_random_uuid()" })
  id!: string;

  @Column({ type: "timestamptz", default: () => "now()" })
  created_at!: Date;

  @Column({ type: "uuid" })
  user_id!: string;

  @ManyToOne(() => User, { onDelete: "CASCADE" })
  @JoinColumn({ name: "user_id" })
  user!: User;

  @Column({ type: "uuid" })
  book_id!: string;

  @ManyToOne(() => Book, { onDelete: "CASCADE" })
  @JoinColumn({ name: "book_id" })
  book!: Book;

  @Column({ type: "boolean", default: false })
  is_receiver!: boolean;

  @Column({ type: "boolean", default: false })
  is_owner!: boolean;
}
