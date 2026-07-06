export interface Comment {
  id: string;
  authorId: string;
  authorName: string;
  text: string;
  createdAt: string;
}

export interface Post {
  id: string;
  authorId: string;
  authorName: string;
  content: string;
  likes: string[];
  comments: Comment[];
  createdAt: string;
}
