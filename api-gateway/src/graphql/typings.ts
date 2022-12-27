/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export interface CreateCommentInput {
    text: string;
    post: string;
}

export interface UpdateCommentInput {
    text?: Nullable<string>;
}

export interface CreatePostInput {
    title: string;
    body: string;
    published: boolean;
}

export interface UpdatePostInput {
    title?: Nullable<string>;
    body?: Nullable<string>;
    published?: Nullable<boolean>;
}

export interface SignupUserInput {
    name: string;
    email: EmailAddress;
    password: string;
    age?: Nullable<UnsignedInt>;
}

export interface LoginUserInput {
    email: EmailAddress;
    password: string;
}

export interface UpdateProfileInput {
    name?: Nullable<string>;
    age?: Nullable<UnsignedInt>;
}

export interface UpdateEmailInput {
    email: EmailAddress;
    currentPassword: string;
}

export interface UpdatePasswordInput {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}

export interface IMutation {
    signup(data: SignupUserInput): UserPayload | Promise<UserPayload>;
    login(data: LoginUserInput): UserPayload | Promise<UserPayload>;
    refreshToken(): UserPayload | Promise<UserPayload>;
    logout(): boolean | Promise<boolean>;
    createComment(data: CreateCommentInput): CommentPayload | Promise<CommentPayload>;
    updateComment(id: string, data: UpdateCommentInput): CommentPayload | Promise<CommentPayload>;
    deleteComment(id: string): DeleteCommentPayload | Promise<DeleteCommentPayload>;
    createPost(data: CreatePostInput): PostPayload | Promise<PostPayload>;
    updatePost(id: string, data: UpdatePostInput): PostPayload | Promise<PostPayload>;
    deletePost(id: string): DeletePostPayload | Promise<DeletePostPayload>;
    updateProfile(data: UpdateProfileInput): UserPayload | Promise<UserPayload>;
    updateEmail(data?: Nullable<UpdateEmailInput>): UserPayload | Promise<UserPayload>;
    updatePassword(data?: Nullable<UpdatePasswordInput>): UserPayload | Promise<UserPayload>;
    deleteAccount(): DeleteAccountPayload | Promise<DeleteAccountPayload>;
}

export interface IQuery {
    comments(q?: Nullable<string>, limit?: Nullable<number>, offset?: Nullable<number>, filterBy?: Nullable<JSONObject>, orderBy?: Nullable<string>): Nullable<CommentsConnection> | Promise<Nullable<CommentsConnection>>;
    commentCount(q?: Nullable<string>, filterBy?: Nullable<JSONObject>): number | Promise<number>;
    post(id: string): Post | Promise<Post>;
    posts(q?: Nullable<string>, limit?: Nullable<number>, offset?: Nullable<number>, filterBy?: Nullable<JSONObject>, orderBy?: Nullable<string>): Nullable<PostsConnection> | Promise<Nullable<PostsConnection>>;
    postCount(q?: Nullable<string>, filterBy?: Nullable<JSONObject>): number | Promise<number>;
    myPosts(q?: Nullable<string>, limit?: Nullable<number>, offset?: Nullable<number>, filterBy?: Nullable<JSONObject>, orderBy?: Nullable<string>): Nullable<PostsConnection> | Promise<Nullable<PostsConnection>>;
    user(id: string): User | Promise<User>;
    users(q?: Nullable<string>, limit?: Nullable<number>, offset?: Nullable<number>, filterBy?: Nullable<JSONObject>, orderBy?: Nullable<string>): Nullable<UsersConnection> | Promise<Nullable<UsersConnection>>;
    userCount(q?: Nullable<string>, filterBy?: Nullable<JSONObject>): number | Promise<number>;
    me(): User | Promise<User>;
}

export interface ISubscription {
    commentAdded(post: string): Comment | Promise<Comment>;
    postAdded(): Post | Promise<Post>;
}

export interface Comment {
    id: string;
    text: string;
    author: User;
    post: Post;
    createdAt: DateTime;
    updatedAt: DateTime;
    version: number;
}

export interface CommentsConnection {
    rows: Comment[];
    pageInfo: PageInfo;
}

export interface CommentPayload {
    errors?: Nullable<Nullable<ErrorPayload>[]>;
    comment?: Nullable<Comment>;
}

export interface DeleteCommentPayload {
    errors?: Nullable<Nullable<ErrorPayload>[]>;
    count?: Nullable<number>;
}

export interface ErrorPayload {
    field?: Nullable<string>;
    message?: Nullable<Nullable<string>[]>;
}

export interface PageInfo {
    count: number;
}

export interface Post {
    id: string;
    title: string;
    body: string;
    published: boolean;
    author: User;
    comments?: Nullable<CommentsConnection>;
    createdAt: DateTime;
    updatedAt: DateTime;
    version: number;
}

export interface PostsConnection {
    rows: Post[];
    pageInfo: PageInfo;
}

export interface PostPayload {
    errors?: Nullable<Nullable<ErrorPayload>[]>;
    post?: Nullable<Post>;
}

export interface DeletePostPayload {
    errors?: Nullable<Nullable<ErrorPayload>[]>;
    count?: Nullable<number>;
}

export interface User {
    id: string;
    name: string;
    email: EmailAddress;
    age?: Nullable<UnsignedInt>;
    posts?: Nullable<PostsConnection>;
    comments?: Nullable<CommentsConnection>;
    createdAt: DateTime;
    updatedAt: DateTime;
    version: number;
}

export interface UsersConnection {
    rows: User[];
    pageInfo: PageInfo;
}

export interface UserPayload {
    errors?: Nullable<Nullable<ErrorPayload>[]>;
    user?: Nullable<User>;
}

export interface DeleteAccountPayload {
    errors?: Nullable<Nullable<ErrorPayload>[]>;
    count?: Nullable<number>;
}

export type DateTime = any;
export type EmailAddress = any;
export type UnsignedInt = any;
export type JSONObject = any;
type Nullable<T> = T | null;
