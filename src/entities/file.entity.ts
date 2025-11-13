import { BaseEntity, Column, Entity, PrimaryColumn } from "typeorm";

@Entity({ schema: "public", name: "file" })
export class File extends BaseEntity {
  @PrimaryColumn({ type: "uuid", default: () => "gen_random_uuid()" })
  id!: string;

  @Column({ type: "timestamptz", default: () => "now()" })
  created_at!: Date;

  @Column({ type: "text" })
  path!: string;

  @Column({ type: "text" })
  mime_type!: string;

  @Column({ type: "bigint", nullable: true })
  file_size?: number | null;
}
