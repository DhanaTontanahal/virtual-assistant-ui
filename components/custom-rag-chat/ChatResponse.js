import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import { motion } from "framer-motion";
import { FaThumbsUp, FaThumbsDown } from "react-icons/fa";

const ChatResponse = ({ message, videoLink, isAssistant }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [feedback, setFeedback] = useState(null);

  if (!message && !videoLink) return null;

  const getYouTubeEmbedUrl = (url) => {
    if (!url) return null;
    const regExp =
      /(?:youtube\.com\/(?:.*v=|.*\/|.*embed\/)||youtu.be\/)([^"&?\/\s]+)/;
    const match = url.match(regExp);
    const videoId = match ? match[1] : null;
    return videoId
      ? `https://www.youtube.com/embed/${videoId}?autoplay=1`
      : null;
  };

  const youtubeEmbedUrl = getYouTubeEmbedUrl(videoLink);
  const isYouTubeVideo = !!youtubeEmbedUrl;
  const isDirectVideo = videoLink?.match(/\.(mp4|webm|ogg)$/);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="p-4 bg-gray-100 border border-gray-300 rounded-md shadow-md mt-2"
      >
        {message && (
          <>
            {(() => {
              try {
                const parsedMessage = JSON.parse(message);
                return (
                  <div>
                    <ReactMarkdown className="text-gray-800 leading-relaxed">
                      {parsedMessage.answer}
                    </ReactMarkdown>

                    {parsedMessage.videoLink && (
                      <div className="mt-3">
                        <iframe
                          width="100%"
                          height="250"
                          src={parsedMessage.videoLink.replace(
                            "watch?v=",
                            "embed/"
                          )}
                          title="Video Response"
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        ></iframe>
                      </div>
                    )}

                    {parsedMessage.additionalHelp && (
                      <p className="text-sm text-gray-500 mt-2">
                        {parsedMessage.additionalHelp}
                      </p>
                    )}
                  </div>
                );
              } catch (e) {
                return (
                  <ReactMarkdown className="text-gray-800 leading-relaxed">
                    {message}
                  </ReactMarkdown>
                );
              }
            })()}
          </>
        )}

        {videoLink && (
          <div
            className="video-thumbnail mt-3"
            onClick={(e) => {
              e.preventDefault();
              setIsModalOpen(true);
            }}
            style={{ cursor: "pointer", position: "relative" }}
          >
            {isYouTubeVideo ? (
              <img
                src={`https://img.youtube.com/vi/${
                  youtubeEmbedUrl.split("/embed/")[1].split("?")[0]
                }/hqdefault.jpg`}
                alt="Video Thumbnail"
                width="100%"
                height="200"
                className="rounded-md shadow-md"
              />
            ) : (
              <video width="100%" height="200" className="rounded-md shadow-md">
                <source src={videoLink} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            )}
            <div className="play-button-overlay">▶</div>
          </div>
        )}

        {isAssistant && (
          <div className="feedback-section">
            <span>Was this helpful?</span>
            <FaThumbsUp
              className={`feedback-icon ${feedback === "like" ? "active" : ""}`}
              onClick={() => setFeedback("like")}
            />
            <FaThumbsDown
              className={`feedback-icon ${
                feedback === "dislike" ? "active" : ""
              }`}
              onClick={() => setFeedback("dislike")}
            />
          </div>
        )}
      </motion.div>

      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <span
              className="close-button"
              onClick={() => setIsModalOpen(false)}
            >
              ✖
            </span>
            {isYouTubeVideo ? (
              <iframe
                width="100%"
                height="400"
                src={youtubeEmbedUrl}
                title="Video Response"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            ) : (
              <video width="100%" height="400" controls autoPlay>
                <source src={videoLink} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            )}
          </div>
        </div>
      )}

      <style jsx>{`
        .video-thumbnail {
          position: relative;
          display: inline-block;
        }
        .play-button-overlay {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: rgba(0, 0, 0, 0.6);
          color: white;
          font-size: 40px;
          padding: 10px 20px;
          border-radius: 50%;
          cursor: pointer;
        }
        .feedback-section {
          display: flex;
          align-items: center;
          gap: 10px;
          padding-top: 8px;
          font-size: 14px;
          color: #666;
          margin-top: 10px;
        }
        .feedback-icon {
          font-size: 18px;
          cursor: pointer;
          color: #999;
          transition: color 0.2s ease-in-out;
        }
        .feedback-icon:hover {
          color: #000;
        }
        .feedback-icon.active {
          color: #007bff;
        }
      `}</style>
    </>
  );
};

export default ChatResponse;
