/**
 * This file demonstrates how to use tRPC's type inference capabilities 
 * for end-to-end type safety without manual type definitions
 */

import { type RouterInputs, type RouterOutputs } from '@/lib/trpc/types';

// Type inference for router inputs (parameters to API calls)
export type CreatePostInput = RouterInputs['posts']['create']; // Type for creating a post
export type UpdatePostInput = RouterInputs['posts']['update']; // Type for updating a post
export type PostIdInput = RouterInputs['posts']['getById']; // Type for post ID parameter

// Type inference for router outputs (API responses)
export type PostData = RouterOutputs['posts']['getById']; // Single post return type
export type PostsList = RouterOutputs['posts']['list']; // Array of posts return type
export type CategoryData = RouterOutputs['categories']['getById']; // Single category return type

// Example of extracting nested types
export type CategoryInPost = PostData['categories'][number];

/**
 * Examples of how to use these types in your application:
 * 
 * 1. For component props:
 * interface PostCardProps {
 *   post: PostData;
 *   onUpdate: (data: UpdatePostInput) => void;
 * }
 * 
 * 2. For React state:
 * const [posts, setPosts] = useState<PostsList>([]);
 * 
 * 3. For form data:
 * const defaultValues: CreatePostInput = {
 *   title: '',
 *   content: '',
 *   published: false,
 *   categoryIds: []
 * };
 * 
 * 4. For API hooks:
 * const { data } = api.posts.list.useQuery();
 * // TypeScript automatically knows that data is of type PostsList
 * 
 * const { mutate } = api.posts.create.useMutation();
 * // TypeScript ensures you pass in a valid CreatePostInput
 */

// Helper function with typed parameters (as an example)
export function formatPost(post: PostData): string {
  return `${post.title} (${post.categories.map(c => c.name).join(', ')})`;
}

// Example of using type inference with generics
export function filterEntitiesByProperty<T extends { id: string | number }>(
  items: T[],
  propertyName: keyof T,
  value: T[keyof T]
): T[] {
  return items.filter(item => item[propertyName] === value);
}

// Usage example:
// const publishedPosts = filterEntitiesByProperty(posts, 'published', true);