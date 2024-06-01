import { getAllBlogPosts, getAllTopics } from "../../Lib/Data";
import { serialize } from "next-mdx-remote/serialize";
import Navbar from "../../Components/Navbar";
import Footer from "../../Components/Footer";
import Head from "next/head";
import BlogInner from "../../Components/BlogInner";
import BlogShare from "../../Components/BlogShare";
import Comments from "../../Components/Comments";
import { SWRConfig } from "swr";
import { remarkHeadingId } from "remark-custom-heading-id";
import { getHeadings } from "../../Lib/GetHeadings";
import LikeBtn from "../../Components/LikeBtn";

export const getStaticPaths = async () => {
  try {
    // Ensure allBlogs is an array
    const allBlogs = await getAllBlogPosts();
    // Generate paths for all blog post pages
    return {
      paths: allBlogs.map((blog) => ({
        params: {
          id: String(blog.data.Title.split(" ").join("-").toLowerCase()),
        },
      })),
      fallback: false,
    };
  } catch (error) {
    console.error("Error in getStaticPaths:", error);
    return {
      paths: [],
      fallback: false,
    };
  }
};


export const getStaticProps = async ({ params }) => {
  try {
    const id = params?.id;

    const allBlogs = await getAllBlogPosts();
    const allTopics = await getAllTopics();

    const page = allBlogs.find(
      (blog) =>
        String(blog.data.Title.split(" ").join("-").toLowerCase()) === id
    );

    if (!page) {
      console.log(`Blog post with id ${id} not found`);
      return {
        notFound: true,
      };
    }

    const { data, content } = page;

    try {
      const mdxSource = await serialize(content, {
        scope: data,
        mdxOptions: { remarkPlugins: [remarkHeadingId] },
      });

      const headings = await getHeadings(content);

      return {
        props: {
          data: data,
          content: mdxSource,
          id: id,
          headings: headings,
          topics: allTopics,
        },
      };
    } catch (serializationError) {
      console.error("Error serializing MDX content:", serializationError);
      console.error("headingsa id",remarkHeadingId);
      console.error("MDX data:", data);
      console.error("MDX Content:", content);
      return {
        notFound: true,
      };
    }
  } catch (error) {
    console.error("Error in getStaticProps:", error);
    return {
      notFound: true,
    };
  }
};



function BlogPostPage({ data, content, id, headings, topics }) {
  return (
    <>
      <Head>
        <title>{data.Title}</title>
        <meta name="title" content={data.Title} />
        <meta name="description" content={data.Abstract} />

        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://blogs.soumya-jit.tech/" />
        <meta property="og:title" content={data.Title} />
        <meta property="og:description" content={data.Abstract} />
        <meta
          property="og:image"
          content={`https://raw.githubusercontent.com/soumyajit4419/Bits-0f-C0de/main/public${data.HeaderImage}`}
        />

        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://blogs.soumya-jit.tech/" />
        <meta property="twitter:title" content={data.Title} />
        <meta property="twitter:description" content={data.Abstract} />
        <meta
          property="twitter:image"
          content={`https://raw.githubusercontent.com/soumyajit4419/Bits-0f-C0de/main/public${data.HeaderImage}`}
        />
      </Head>

      <div className="min-h-screen relative bg-white dark:bg-gray-900">
        <Navbar topics={topics} />
        <div className="py-24">
          <BlogInner data={data} content={content} headings={headings} />

          <BlogShare data={data} />


          <Footer />
        </div>
      </div>
    </>
  );
}

export default BlogPostPage;
