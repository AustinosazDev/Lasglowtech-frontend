export default function BlogContent({ content = "" }) {
  // Preserve empty lines before rendering
  const processedContent = content
    .replace(/<p><br><\/p>/g, "<p>&nbsp;</p>")
    .replace(/<p><br\/><\/p>/g, "<p>&nbsp;</p>");

  return (
    <div
      className="blog-content prose prose-lg max-w-none mx-auto
        prose-headings:text-textcolor2 prose-headings:font-bold
        prose-p:text-textcolor2 prose-p:leading-relaxed
        prose-a:text-Secondarycolor prose-a:no-underline hover:prose-a:underline
        prose-strong:text-textcolor2 prose-strong:font-semibold
        prose-code:text-Secondarycolor prose-code:bg-Primarycolor/10 prose-code:px-1 prose-code:rounded
        prose-pre:bg-Primarycolor/10 prose-pre:border prose-pre:border-Primarycolor/30
        prose-blockquote:border-l-4 prose-blockquote:border-Secondarycolor prose-blockquote:bg-Secondarycolor/5 prose-blockquote:py-2 prose-blockquote:px-4
        prose-ul:text-textcolor2 prose-ol:text-textcolor2
        prose-li:text-textcolor2
        prose-hr:border-Primarycolor/30
        prose-img:max-w-full prose-img:h-auto prose-img:rounded-lg
        [&_*]:max-w-full [&_*]:break-words
        [&_p]:min-h-[1em]
        [&_p:has(br)]:min-h-[1.5em]"
      dangerouslySetInnerHTML={{ __html: processedContent }}
    />
  );
}
