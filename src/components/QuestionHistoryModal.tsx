import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from '@/components/ui/card';
import { ScrollArea } from "@/components/ui/scroll-area";
import { History } from 'lucide-react';
import { format } from 'date-fns';
import { Question } from '@/types';

const QuestionHistoryModal = ({
  questions,
  onSelectQuestion,
}: {
  questions: Question[];
  onSelectQuestion: (question: Question) => void;
}) => {
  const handleQuestionSelect = (question: Question) => {
    onSelectQuestion(question);
  };

  // Sort questions by date
  questions.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <History className="h-4 w-4"/>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl bg-transparent border-none shadow-none text-white">
        <DialogHeader className="relative">
          <DialogTitle className="text-xl font-semibold text-center mb-4">Preguntas anteriores</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[400px] w-full rounded-md">
          {questions.map((question) => (
            <DialogClose key={question.id} asChild>
              <Card
                className="mb-4 p-4 transition-all duration-200 cursor-pointer"
                onClick={() => handleQuestionSelect(question)}
              >
                <p className="text-sm font-medium mb-1">
                  {format(new Date(question.created_at), 'MMM d, yyyy')}
                </p>
                <p>{question.question}</p>
              </Card>
            </DialogClose>
          ))}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default QuestionHistoryModal;