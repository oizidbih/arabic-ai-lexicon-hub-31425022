import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { useLanguage } from "@/contexts/useLanguage";
import { supabase, type Comment } from "@/lib/supabase";
import { toast } from "@/hooks/use-toast";

interface CommentSectionProps {
  termId: string;
}

const CommentSection: React.FC<CommentSectionProps> = ({ termId }) => {
  const { t, language } = useLanguage();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const loadComments = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from("feedback")
          .select("*")
          .eq("term_id", termId)
          .order("created_at", { ascending: false });

        if (error) throw error;
        setComments(data || []);
      } catch (error) {
        console.error("Error loading comments:", error);
        toast({
          title: t("Error"),
          description: t("Failed to load comments"),
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadComments();
  }, [termId, t]);

  const handleSubmitComment = async () => {
    if (!newComment.trim()) return;

    setIsSubmitting(true);
    try {
      const { error } = await supabase.from("feedback").insert([
        {
          term_id: termId,
          comment: newComment,
        },
      ]);

      if (error) throw error;

      toast({
        title: t("success"),
        description: "Comment added successfully",
      });
      setNewComment("");
      // loadComments() // No longer needed, as comments are re-fetched on termId change
    } catch (error) {
      console.error("Error submitting comment:", error);
      toast({
        title: t("error"),
        description: "Failed to add comment",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <h4 className="font-semibold text-slate-800">{t("comments")}</h4>

      <div className="space-y-2">
        <Textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder={
            language === "en" ? "Add your feedback..." : "أضف تعليقك..."
          }
          className={language === "ar" ? "text-right" : ""}
          rows={3}
        />
        <Button
          onClick={handleSubmitComment}
          disabled={isSubmitting || !newComment.trim()}
          size="sm"
          className="bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600"
        >
          {isSubmitting ? t("loading") : t("addComment")}
        </Button>
      </div>

      {isLoading ? (
        <p className="text-slate-500">{t("loading")}</p>
      ) : comments.length === 0 ? (
        <p className="text-slate-500 text-sm">
          {language === "en" ? "No comments yet" : "لا توجد تعليقات بعد"}
        </p>
      ) : (
        <div className="space-y-3 max-h-60 overflow-y-auto">
          {comments.map((comment) => (
            <Card key={comment.id} className="p-3 bg-slate-50">
              <p className="text-sm">{comment.comment}</p>
              <p className="text-xs text-slate-400 mt-1">
                {new Date(comment.created_at).toLocaleDateString()}
              </p>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentSection;
