"use client";

import React from "react";

interface MarkdownInterpreterProps {
  content: string;
  className?: string;
  uniqueKey?: string;
}

/**
 * A simple markdown interpreter component that renders basic markdown syntax
 * Supports: headings (h1-h3), paragraphs, lists, and line breaks
 */
export const MarkdownInterpreter: React.FC<MarkdownInterpreterProps> = ({
  content,
  className = "",
  uniqueKey = "markdown",
}) => {
  const renderMarkdown = () => {
    return content.split("\n").map((paragraph, paragraphIndex) => {
      // Create a unique key using content hash
      const contentKey = `${uniqueKey}-${paragraphIndex}-${paragraph
        .slice(0, 10)
        .replace(/\s+/g, "-")}`;

      // Handle headings
      if (paragraph.startsWith("# ")) {
        return (
          <h1 key={`h1-${contentKey}`} className="markdown__h1">
            {paragraph.slice(2)}
          </h1>
        );
      } else if (paragraph.startsWith("## ")) {
        return (
          <h2 key={`h2-${contentKey}`} className="markdown__h2">
            {paragraph.slice(3)}
          </h2>
        );
      } else if (paragraph.startsWith("### ")) {
        return (
          <h3 key={`h3-${contentKey}`} className="markdown__h3">
            {paragraph.slice(4)}
          </h3>
        );
      }

      // Handle list items
      else if (paragraph.startsWith("- ")) {
        return (
          <ul key={`ul-${contentKey}`} className="markdown__list">
            <li className="markdown__list-item">{paragraph.slice(2)}</li>
          </ul>
        );
      }

      // Handle empty paragraphs
      else if (paragraph.trim() === "") {
        return <br key={`br-${uniqueKey}-${paragraphIndex}`} />;
      }

      // Handle regular paragraphs
      else {
        return (
          <p key={`p-${contentKey}`} className="markdown__paragraph">
            {paragraph}
          </p>
        );
      }
    });
  };

  return <div className={`markdown ${className}`}>{renderMarkdown()}</div>;
};
