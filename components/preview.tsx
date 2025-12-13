"use client";

interface PreviewProps {
  value: string;
}

export const Preview = ({ value }: PreviewProps) => {
  if (!value) {
    return null;
  }

  return (
    <div
      className="[&_a]:text-primary [&_a]:hover:text-primary/80 mt-2 text-left text-sm [&_*]:text-left [&_a]:cursor-pointer [&_a]:underline [&_blockquote]:my-4 [&_blockquote]:rounded-r [&_blockquote]:border-l-4 [&_blockquote]:border-gray-300 [&_blockquote]:bg-gray-50 [&_blockquote]:py-2 [&_blockquote]:pl-4 [&_blockquote]:!text-left [&_blockquote]:text-gray-700 [&_blockquote]:italic [&_em]:italic [&_h1]:mt-6 [&_h1]:mb-4 [&_h1]:!text-left [&_h1]:text-3xl [&_h1]:leading-tight [&_h1]:font-bold [&_h2]:mt-5 [&_h2]:mb-3 [&_h2]:!text-left [&_h2]:text-2xl [&_h2]:leading-tight [&_h2]:font-bold [&_h3]:mt-4 [&_h3]:mb-2 [&_h3]:!text-left [&_h3]:text-xl [&_h3]:font-bold [&_h4]:mt-3 [&_h4]:mb-2 [&_h4]:!text-left [&_h4]:text-lg [&_h4]:font-bold [&_h5]:mt-3 [&_h5]:mb-1 [&_h5]:!text-left [&_h5]:text-base [&_h5]:font-bold [&_h6]:mt-2 [&_h6]:mb-1 [&_h6]:!text-left [&_h6]:text-sm [&_h6]:font-bold [&_li]:mb-1 [&_li]:!text-left [&_ol]:mb-2 [&_ol]:ml-6 [&_ol]:list-decimal [&_ol]:space-y-1 [&_ol]:!text-left [&_p]:mb-2 [&_p]:!text-left [&_p]:last:mb-0 [&_strong]:font-bold [&_u]:underline [&_ul]:mb-2 [&_ul]:ml-6 [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:!text-left"
      style={{ textAlign: "left" }}
      dangerouslySetInnerHTML={{ __html: value }}
    />
  );
};
