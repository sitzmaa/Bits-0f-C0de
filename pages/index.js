import Head from "next/head";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import Header from "../Components/Header";
import BlogHeader from "../Components/BlogHeader";
import { getAllBlogPosts, getAllTopics } from "../Lib/Data";

export const getStaticProps = async () => {
  const allBlogs = await getAllBlogPosts();
  const allTopics = await getAllTopics();
  return {
    props: {
      blogs: allBlogs,
      topics: allTopics,
    },
  };
};

export default function Home({ blogs, topics }) {
  return (
    <>
      <Head>
        <title>Alexander's Blog</title>
        <meta name="title" content="Alexander's Blog" />
        <meta
          name="description"
          content="Project Blog space for Alexander Sitzman"
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://blogs.alexsitzman.com/" />
        <meta property="og:title" content="Alexander's Blog" />
        <meta
          property="og:description"
          content="Project Blog space for Alexander Sitzman"
        />
        <meta
          property="og:image"
          content="https://raw.githubusercontent.com/soumyajit4419/Bits-0f-C0de/main/Extra/sc.png"
        />
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://blogs.alexsitzman.com/" />
        <meta property="twitter:title" content="Alexander's Blog" />
        <meta
          property="twitter:description"
          content="Project Blog space for Alexander Sitzman"
        />
        <meta
          property="twitter:image"
          content="https://raw.githubusercontent.com/soumyajit4419/Bits-0f-C0de/main/Extra/sc.png"
        />
      </Head>

      <div className="min-h-screen relative bg-white dark:bg-gray-900">
        <Navbar topics={topics} />
        <Header />
        <div className="px-0.5 md:px-7 pb-14 pt-6">
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {blogs &&
              blogs.map(
                (blog) =>
                  blog.data.isPublished && (
                    <div key={blog.data.Id} className="aspect-w-1 aspect-h-1">
                      <BlogHeader
                        data={blog.data}
                        content={blog.content}
                        readTime={blog.readTime.text}
                      />
                    </div>
                  )
              )}
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}
