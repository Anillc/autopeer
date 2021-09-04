import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'

@Entity()
export class Server extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ unique: true })
    name: string

    @Column()
    description: string

    @Column()
    publicKey: string

    @Column()
    dn42v4: string

    @Column()
    linkLocal: string

    @Column()
    asn: string

    @ManyToOne(type => Peer, peer => peer.server)
    peers: Peer[]

    @UpdateDateColumn()
    updatedAt: Date
}

@Entity()
export class User extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    githubId: number

    @Column()
    name: string

    @Column()
    email: string

    @Column()
    avatarUrl: string

    @OneToMany(type => Peer, peer => peer.user)
    peers: Peer[]

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date
}

@Entity()
export class Peer extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number

    @ManyToOne(type => User, user => user.peers)
    user: User

    @ManyToOne(type => Server, server => server.peers)
    server: Server

    @Column()
    peerAddress: string

    @Column()
    peerPort: number

    @Column()
    peerASN: string

    @Column()
    peerIPv4: string

    @Column()
    peerLinkLocal: string

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date
}