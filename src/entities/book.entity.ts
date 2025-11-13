import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryColumn,
} from "typeorm";
import { File } from "./file.entity";
import { Language } from "../enums/language.enum";
import { BookState } from "../enums/book.enum";

@Entity({ schema: "public", name: "book" })
export class Book extends BaseEntity {
  @PrimaryColumn({ type: "uuid", default: () => "gen_random_uuid()" })
  id!: string;

  @Column({ type: "timestamptz", default: () => "now()" })
  created_at!: Date;

  @Column({ type: "uuid", nullable: true })
  cover_image_id?: string;

  @OneToOne(() => File, { onDelete: "SET NULL" })
  @JoinColumn({ name: "cover_image_id" })
  cover_image?: File;

  @Column({ type: "text", nullable: true })
  title?: string;

  @Column({ type: "text", nullable: true })
  subtitle?: string;

  @Column({ type: "text", nullable: true })
  spine?: string;

  @Column({
    type: "enum",
    enum: BookState,
    enumName: "book_state",
    default: BookState.ONBOARDING,
    nullable: true,
  })
  state?: BookState;

  @Column({ type: "bigint", nullable: true })
  cover_style?: number;

  @Column({
    type: "enum",
    enum: Language,
    enumName: "language",
    nullable: true,
  })
  language?: Language;

  @Column({ type: "text", nullable: true })
  receiver_full_name?: string;

  @Column({ type: "text", nullable: true })
  author_name?: string;

  @Column({ type: "text", nullable: true })
  background_color?: string;

  @Column({ type: "text", nullable: true })
  text_color?: string;

  @Column({ type: "boolean", default: false })
  is_free_book_claimed!: boolean;
}
