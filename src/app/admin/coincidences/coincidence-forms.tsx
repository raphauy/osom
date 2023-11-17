"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "@/components/ui/use-toast";
import { useEffect, useState } from "react";
import {
  deleteCoincidenceAction,
  createOrUpdateCoincidenceAction,
  getCoincidenceDAOAction,
} from "./coincidence-actions";
import {
  coincidenceFormSchema,
  CoincidenceFormValues,
} from "@/services/coincidence-services";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Loader } from "lucide-react";

type Props = {
  id?: string;
  closeDialog: () => void;
};

export function CoincidenceForm({ id, closeDialog }: Props) {
  const form = useForm<CoincidenceFormValues>({
    resolver: zodResolver(coincidenceFormSchema),
    defaultValues: {},
    mode: "onChange",
  });
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: CoincidenceFormValues) => {
    setLoading(true);
    try {
      await createOrUpdateCoincidenceAction(id ? id : null, data);
      toast({ title: id ? "Coincidence updated" : "Coincidence created" });
      closeDialog();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      getCoincidenceDAOAction(id).then((data) => {
        if (data) {
          form.reset(data);
        }
        Object.keys(form.getValues()).forEach((key: any) => {
          if (form.getValues(key) === null) {
            form.setValue(key, "");
          }
        });
      });
    }
  }, [form, id]);

  return (
    <div className="p-4 bg-white rounded-md">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="number"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Number</FormLabel>
                <FormControl>
                  <Input placeholder="Coincidence's number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="distance"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Distance</FormLabel>
                <FormControl>
                  <Input placeholder="Coincidence's distance" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="pedidoId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>PedidoId</FormLabel>
                <FormControl>
                  <Input placeholder="Coincidence's pedidoId" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="propertyId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>PropertyId</FormLabel>
                <FormControl>
                  <Input placeholder="Coincidence's propertyId" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end">
            <Button
              onClick={() => closeDialog()}
              type="button"
              variant={"secondary"}
              className="w-32"
            >
              Cancel
            </Button>
            <Button type="submit" className="w-32 ml-2">
              {loading ? (
                <Loader className="h-4 w-4 animate-spin" />
              ) : (
                <p>Save</p>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

export function DeleteCoincidenceForm({ id, closeDialog }: Props) {
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    if (!id) return;
    setLoading(true);
    deleteCoincidenceAction(id)
      .then(() => {
        toast({ title: "Coincidence deleted" });
      })
      .catch((error) => {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      })
      .finally(() => {
        setLoading(false);
        closeDialog && closeDialog();
      });
  }

  return (
    <div>
      <Button
        onClick={() => closeDialog && closeDialog()}
        type="button"
        variant={"secondary"}
        className="w-32"
      >
        Cancelar
      </Button>
      <Button
        onClick={handleDelete}
        variant="destructive"
        className="w-32 ml-2 gap-1"
      >
        {loading && <Loader className="h-4 w-4 animate-spin" />}
        Delete
      </Button>
    </div>
  );
}
