export const typeDefs = `#graphql
 type Query {
    personal: User
    posts:[Post!]!
    profile(userId: ID!): Profile
 }

 type Mutation {
   postCreate(post: PostInput!): PostPayload!
   postUpdate(postId: ID!, post:PostInput): PostPayload!
   postDelete(postId:ID!): PostPayload!
   postPublish(postId:ID!):PostPayload
   postUnpublish(postId:ID!):PostPayload
   signup(credentials:AuthInput! name:String!, bio:String!): AuthPayload!
   signin(credentials: AuthInput!):AuthPayload!
 }

 type Post {
   id: ID!
   title:String!
   content:String!
   createdAt: String!
   published:Boolean!
   user:User!
 }

 type User {
   id:ID!
   name:String!
   email:String!
  #  profile:Profile 
   posts:[Post!]!
 }

 type Profile {
   id:ID!
   bio:String!
   #add this to determine if this is authenticated user profile(REACT)
   isMyProfile:Boolean!
   user:User!
 }

 type UserError{
   message:String!
 }

 type PostPayload {
   userErrors:[UserError!]!
   post:Post
 }

 type AuthPayload {
  userErrors:[UserError!]!
  token:String
 }
  
  input PostInput {
    title:String
    content:String
  }

  input AuthInput{
    email:String
    password:String
  }
`;
