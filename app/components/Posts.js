"use client";
import { createClient } from "contentful";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import { BLOCKS, INLINES } from "@contentful/rich-text-types";
import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image"; // Import Image from Next.js

const SPACE_ID = process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID;
const ACCESS_TOKEN = process.env.NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN;

const client = createClient({
  space: SPACE_ID,
  accessToken: ACCESS_TOKEN,
});

const renderOptions = {
  renderNode: {
    [BLOCKS.EMBEDDED_ASSET]: (node) => {
      const { file } = node.data.target.fields;
      // Check if it's an image or GIF
      if (!file?.url) return null;
      
      // Fix protocol-relative URLs
      const imageUrl = file.url.startsWith('//') 
        ? `https:${file.url}` 
        : file.url;
        
      return (
        <div className="w-1/2 h-auto mx-auto mt-4 relative">
          <Image 
            src={imageUrl} 
            alt={file.title || "Embedded image"} 
            width={500}
            height={300}
            className="rounded-lg"
            style={{ width: '100%', height: 'auto' }}
          />
        </div>
      );
    },
    [INLINES.HYPERLINK]: (node) => {
      return (
        <a href={node.data.uri} target="_blank" rel="noopener noreferrer" className="text-bloggreen underline">
          {node.content[0].value}
        </a>
      );
    },
    [BLOCKS.EMBEDDED_ENTRY]: (node) => {
      if (node.data.target.fields.videoUrl) {
        return (
          <div className="mt-4 w-1/2 mx-auto">
            <iframe
              width="100%"
              height="315"
              src={node.data.target.fields.videoUrl}
              title="Embedded Video"
              frameBorder="0"
              allowFullScreen
            ></iframe>
          </div>
        );
      }
      return null;
    },
    // Heading support
    [BLOCKS.HEADING_1]: (node, children) => <h1 className="text-3xl font-bold mt-6 mb-4 text-bloggreen">{children}</h1>,
    [BLOCKS.HEADING_2]: (node, children) => <h2 className="text-2xl font-bold mt-6 mb-3 text-bloggreen">{children}</h2>,
    [BLOCKS.HEADING_3]: (node, children) => <h3 className="text-xl font-bold mt-5 mb-2 text-bloggreen">{children}</h3>,
    [BLOCKS.HEADING_4]: (node, children) => <h4 className="text-lg font-bold mt-4 mb-2 text-bloggreen">{children}</h4>,
    [BLOCKS.HEADING_5]: (node, children) => <h5 className="text-base font-bold mt-4 mb-2 text-bloggreen">{children}</h5>,
    [BLOCKS.HEADING_6]: (node, children) => <h6 className="text-sm font-bold mt-4 mb-2 text-bloggreen">{children}</h6>,
    
    // List support
    [BLOCKS.UL_LIST]: (node, children) => <ul className="list-disc pl-6 mt-3 mb-3">{children}</ul>,
    [BLOCKS.OL_LIST]: (node, children) => <ol className="list-decimal pl-6 mt-3 mb-3">{children}</ol>,
    [BLOCKS.LIST_ITEM]: (node, children) => <li className="mb-1">{children}</li>,
  },
};

// Helper function to create a slug from the title
const createSlug = (title) => {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-')     // Replace spaces with hyphens
    .replace(/-+/g, '-');     // Remove consecutive hyphens
};

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [allPostsLoaded, setAllPostsLoaded] = useState(false);
  const [page, setPage] = useState(0);
  const loader = useRef(null);

  useEffect(() => {
    const fetchPosts = async () => {
      if (allPostsLoaded || isLoading) return;

      setIsLoading(true);
      try {
        const perPage = 2;
        const res = await client.getEntries({
          content_type: "owenblog",
          skip: page * perPage,
          limit: perPage,
          order: "-fields.createDate",
          include: 10, // Include linked assets and entries
        });

        if (res.items.length < perPage) {
          setAllPostsLoaded(true);
        }

        setPosts((prevPosts) => {
          const newPosts = res.items.map((item) => ({
            ...item.fields,
            id: item.sys.id, // Store the Contentful entry ID for use in permalinks
            slug: createSlug(item.fields.blogTitle)
          }));
          
          const uniquePosts = Array.from(
            new Map([...prevPosts, ...newPosts].map((post) => [post.blogTitle, post])).values()
          );
          return uniquePosts;
        });
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, [page]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoading && !allPostsLoaded) {
          setPage((prevPage) => prevPage + 1);
        }
      },
      { threshold: 1.0 }
    );

    if (loader.current) {
      observer.observe(loader.current);
    }

    return () => {
      if (loader.current) {
        observer.unobserve(loader.current);
      }
    };
  }, [isLoading, allPostsLoaded]);

  return (
    <div className="w-full flex justify-center pt-10 bg-base-100">
      <div className="w-full max-w-4xl px-6">
        {posts.map((post, index) => (
          <div key={index} className="shadow-xl rounded-lg p-6 mb-10">
            <Link href={`/blog/${post.slug}`} className="cursor-pointer">
              <h1 className="text-3xl font-bold text-[#17A07A] hover:underline">{post.blogTitle}</h1>
            </Link>
            <p className="text-gray-400 text-sm mt-1">
              {post.blogAuthor} • {new Date(post.createDate).toLocaleDateString()}
            </p>
            {post.blogImage?.fields?.file?.url && (
              <Link href={`/blog/${post.slug}`}>
                <div className="relative w-full h-64 mt-4">
                  <Image
                    src={post.blogImage.fields.file.url.startsWith('//') 
                      ? `https:${post.blogImage.fields.file.url}` 
                      : post.blogImage.fields.file.url}
                    alt={post.blogTitle || "Blog post image"}
                    fill
                    className="rounded-lg object-cover cursor-pointer"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
              </Link>
            )}
            <div className="prose prose-invert mt-4">
              {post.blogContent ? (
                <>
                  <div className="line-clamp-4"> {/* Show a preview of the content */}
                    {documentToReactComponents(post.blogContent, renderOptions)}
                  </div>
                  <Link href={`/blog/${post.slug}`} className="text-bloggreen hover:underline mt-4 text-xl inline-block">
                    Read more
                  </Link>
                </>
              ) : (
                <p>No content available.</p>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-center">
            <span className="loading loading-dots loading-lg"></span>
          </div>
        )}
        {!allPostsLoaded && <div ref={loader} className="h-20"></div>}
      </div>
    </div>
  );
};

export default Posts;