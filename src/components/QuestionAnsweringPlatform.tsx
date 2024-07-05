'use client';

import React, { useState, useEffect } from 'react';
import { ThumbsUp, ThumbsDown, RotateCcw, ArrowLeft, ArrowRight, Settings, Sun, Moon, Loader2, Network, Info } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import { Slider } from "@/components/ui/slider"
import { ToastAction } from "@/components/ui/toast"
import { useToast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { askQuestion, redoAnswer, submitEvaluation, getQuestionHistory } from '@/services/api';
import useApi from '@/hooks/useApi';
import DerivationTree from '@/components/DerivationTree';
import Text from '@/components/Text';
import QuestionHistoryModal from '@/components/QuestionHistoryModal';
import { Question, Answer, Config, Evaluation } from '@/types';
import { MODELS, METHODS } from '@/constants';

const QuestionAnsweringPlatform = () => {
  const [question, setQuestion] = useState<string>('');
  const [titleQuestion, setTitleQuestion] = useState<string>('');
  const [currentQuestionId, setCurrentQuestionId] = useState<number | null>(null);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [showDerivation, setShowDerivation] = useState<boolean>(false);
  const [currentAnswerIndex, setCurrentAnswerIndex] = useState<number>(0);
  const [questionHistory, setQuestionHistory] = useState<Question[]>([]);
  const [config, setConfig] = useState<Config>({
    method: 'derivation',
    generative_model: 'CLAUDE_3_HAIKU',
    temperature: 0.0,
  });
  const [evaluation, setEvaluation] = useState<Evaluation>({
    like: null,
    comment: '',
    evaluation_author: ''
  });
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { toast } = useToast()

  const { loading: askLoading, error: askError, execute: executeAskQuestion } = useApi(askQuestion);
  const { loading: redoLoading, error: redoError, execute: executeRedoAnswer } = useApi(redoAnswer);
  const { loading: evalLoading, error: evalError, execute: executeSubmitEvaluation } = useApi(submitEvaluation);
  const { loading: historyLoading, error: historyError, execute: executeGetQuestionHistory } = useApi(getQuestionHistory);


  useEffect(() => {
    // Apply dark mode to the body
    if (isDarkMode) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [isDarkMode]);

  useEffect(() => {
    loadQuestionHistory();
  }, []);

  const loadQuestionHistory = async () => {
    try {
      const history = await executeGetQuestionHistory(null);
      setQuestionHistory(history);
    } catch (error) {
      console.error('Failed to load question history:', error);
      toast({
        variant: "destructive",
        description: "Error al cargar el historial de preguntas",
        action: <ToastAction altText="Reintentar" onClick={loadQuestionHistory} />,
      })
    }
  };

const handleSelectQuestion = async (selectedQuestion: Question) => {
    setQuestion(selectedQuestion.question);
    setCurrentQuestionId(selectedQuestion.id);
    setTitleQuestion(selectedQuestion.question);
    setAnswers(selectedQuestion.answers);
    setShowDerivation(false);
};

  const handleAsk = async () => {
    if (question.trim() === '' || askLoading) return;

    try {
      const data = await executeAskQuestion({ question, config });
      setAnswers([data.answer, ...answers]);
      setCurrentQuestionId(data.questionId);
      setCurrentAnswerIndex(0);
      setEvaluation({ like: null, comment: '', evaluation_author: '' });
      setTitleQuestion(question);
      setShowDerivation(false);
      await loadQuestionHistory(); // Reload history after asking a new question
    } catch (error: any) {
      console.error('Failed to ask question:', error);
      if (error.response && error.response.status === 400) {
        toast({
          variant: "destructive",
          description: "Error al enviar la pregunta: " + error.response.data.message,
          action: <ToastAction altText="Reintentar" onClick={handleAsk} />,
        })
      } else {
        toast({
          variant: "destructive",
          description: "Error al generar la respuesta",
          action: <ToastAction altText="Reintentar" onClick={handleAsk} />,
        })
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAsk();
    }
  };

  const handleRedo = async () => {
    if (redoLoading) return;

    try {
      const newAnswer = await executeRedoAnswer({ questionId: currentQuestionId, config });
      setAnswers([newAnswer, ...answers]);
      setCurrentAnswerIndex(0);
    } catch (error: any) {
      console.error('Failed to redo answer:', error);
      if (error.response && error.response.status === 400) {
        toast({
          variant: "destructive",
          description: "Error al generar la respuesta: " + error.response.data.message,
          action: <ToastAction altText="Reintentar" onClick={handleRedo} />,
        })
      } else {
        toast({
          variant: "destructive",
          description: "Error al generar la respuesta",
          action: <ToastAction altText="Reintentar" onClick={handleRedo} >Reintentar</ToastAction>,
        })
      }
    }
  };

  const handleEvaluate = (like: boolean | null) => {
    let previousLike = evaluation.like;
    if (previousLike === like) {
      like = null;
    }
    setEvaluation({ ...evaluation, like });
  };

  const handleSubmitEvaluation = async () => {
    if (evalLoading) return;

    try {
      await executeSubmitEvaluation({
        answerId: answers[currentAnswerIndex].id,
        evaluation: {
          like: evaluation.like,
          comment: evaluation.comment,
          evaluation_author: evaluation.evaluation_author
        }
      });
      setEvaluation({ like: null, comment: '', evaluation_author: '' });
    } catch (error: any) {
      console.error('Failed to submit evaluation:', error);
      toast({
        variant: "destructive",
        description: "Error al enviar la evaluación: " + error.response.data.message,
        action: <ToastAction altText="Reintentar" onClick={handleSubmitEvaluation} />,
      })
    }
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const get_show_model = (identifier: string) => {
    const model = MODELS.find((model) => model.identifier === identifier);
    return model ? model.show_name : identifier
  }

  const get_show_method = (name: string) => {
    const method = METHODS.find((method) => method.name === name);
    return method ? method.show_name : name
  }

  return (
    <div className={`mx-auto p-4 ${isDarkMode ? 'dark' : ''}`}>
      <div className="flex items-center space-x-2 mb-4">
          <QuestionHistoryModal
            questions={questionHistory}
            onSelectQuestion={handleSelectQuestion}
          />
        <Input
          type="text"
          placeholder="Escribir pregunta"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyPress={handleKeyPress}
          className="flex-grow"
          disabled={redoLoading || askLoading}
        />
        <Button onClick={handleAsk} disabled={redoLoading || askLoading || question.trim() === ''}>
          {redoLoading || askLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Envíar'}
        </Button>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="icon">
              <Settings className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Configuración de respuesta</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="method" className="text-right">Método:</label>
                <Select value={config.method} onValueChange={(value) => setConfig({ ...config, method: value })}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Seleccionar método" />
                  </SelectTrigger>
                  <SelectContent>
                    {METHODS.map((method) => (
                      <SelectItem key={method.name} value={method.name}>{method.show_name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="model" className="text-right">Modelo:</label>
                <Select value={config.generative_model} onValueChange={(value) => setConfig({ ...config, generative_model: value })}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Seleccionar modelo" />
                  </SelectTrigger>
                  <SelectContent>
                    {MODELS.map((model) => (
                      <SelectItem key={model.name} value={model.name}>{model.show_name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="temperature" className="text-right">Temperatura:</label>
                <div className="col-span-3 flex items-center gap-4">
                <Slider
                  min={0.0}
                  max={1.0}
                  step={0.01}
                  value={[config.temperature]}
                  onValueChange={(value) => setConfig({ ...config, temperature: value[0] })}
                  className="col-span-3"
                />
                <p className="col-span-4 text-center">{config.temperature.toFixed(2)}</p>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
        <Button variant="outline" size="icon" onClick={toggleDarkMode}>
          {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>
      </div>

      {answers.length > 0 && (
        <Card className="mb-4">
          <CardHeader>
            <div className="flex justify-between">
            <CardTitle>{titleQuestion}</CardTitle>
            <HoverCard>
              <HoverCardTrigger>
                <Info className="h-4 w-4" />
              </HoverCardTrigger> 
              <HoverCardContent>
                <p><strong>Método:</strong> {get_show_method(answers[currentAnswerIndex].method)}</p>
                <p><strong>Modelo:</strong> {get_show_model(answers[currentAnswerIndex].generative_model)}</p>
                <p><strong>Temperatura:</strong> {answers[currentAnswerIndex].temperature}</p>
              </HoverCardContent>
            </HoverCard>
            </div>
          </CardHeader>
          <CardContent>
            {'derivation' in answers[currentAnswerIndex] && answers[currentAnswerIndex].derivation && showDerivation ? (
              <DerivationTree data={answers[currentAnswerIndex].derivation} onExpand={null} />
            ) :
            <div className="text-justify whitespace-pre-line">
              <Text text={answers[currentAnswerIndex].answer} />
            </div>
            }
          </CardContent>
          <CardFooter className="flex justify-between">
            <div className="flex space-x-2">
              <Button variant="outline" size="icon" onClick={() => handleEvaluate(true)}>
                <ThumbsUp className={`h-4 w-4 ${evaluation.like === true ? 'text-green-500' : ''}`} />
              </Button>
              <Button variant="outline" size="icon" onClick={() => handleEvaluate(false)}>
                <ThumbsDown className={`h-4 w-4 ${evaluation.like === false ? 'text-red-500' : ''}`} />
              </Button>
            </div>
            <div className="flex space-x-2">
              {'derivation' in answers[currentAnswerIndex] && answers[currentAnswerIndex].derivation && (
              <Button variant="outline" size="icon" onClick={() => setShowDerivation((prev) => !prev)}>
                <Network className="h-4 w-4" style={{transform: 'rotate(180deg)' }} />
              </Button>
              )}
              <Button variant="outline" size="icon" onClick={handleRedo} disabled={redoLoading || askLoading}>
                {redoLoading || askLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RotateCcw className="h-4 w-4" />}
              </Button>
            </div>
          </CardFooter>
        </Card>
      )}

      {evaluation.like !== null && (
        <Card className="mb-4">
          <CardHeader>
            <CardTitle>Evaluar respuesta</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Agregar comentario sobre la respuesta generada (opcional)"
              value={evaluation.comment}
              onChange={(e) => setEvaluation({ ...evaluation, comment: e.target.value })}
              className="mb-2"
            />
            <Input
              type="text"
              placeholder="Tu nombre (opcional)"
              value={evaluation.evaluation_author}
              onChange={(e) => setEvaluation({ ...evaluation, evaluation_author: e.target.value })}
              className="mb-2"
            />
            <Button onClick={handleSubmitEvaluation} disabled={evalLoading}>
              {evalLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Enviar evaluación'}
            </Button>
          </CardContent>
        </Card>
      )}

      {answers.length > 1 && (
        <div className="flex justify-center space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentAnswerIndex((prev) => Math.max(0, prev - 1))}
            disabled={currentAnswerIndex === 0}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentAnswerIndex((prev) => Math.min(answers.length - 1, prev + 1))}
            disabled={currentAnswerIndex === answers.length - 1}
          >
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      )}
      <Toaster />
    </div>
  );
};

export default QuestionAnsweringPlatform;