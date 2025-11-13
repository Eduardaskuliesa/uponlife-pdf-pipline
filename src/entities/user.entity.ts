import { Entity, PrimaryColumn, Column, BaseEntity } from "typeorm";

@Entity({ schema: "auth", name: "users" })
export class User extends BaseEntity {
  @PrimaryColumn({ type: "uuid", default: () => "gen_random_uuid()" })
  id!: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  email!: string;

  @Column({ type: "timestamptz", nullable: true })
  email_confirmed_at?: Date;
}
