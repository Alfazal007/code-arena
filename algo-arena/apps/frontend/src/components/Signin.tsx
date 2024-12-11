import { useForm } from "react-hook-form";
import { Button } from "./ui/button";
import { zodTypes } from "@repo/zod/zodTypes";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { UserContext } from "@/context/UserContext";

export const SignIn = () => {
    const navigate = useNavigate();
    const [isSending, setIsSending] = useState<boolean>(false);
    const { user } = useContext(UserContext)
    useEffect(() => {
        if (user) {
            navigate("/")
        }
    }, [])
    const loginUserType = zodTypes.signinType;

    const form = useForm<z.infer<typeof loginUserType>>({
        resolver: zodResolver(loginUserType),
        defaultValues: {
            username: "",
            password: "",
        },
    });
    const { toast } = useToast();

    async function onSubmit(values: z.infer<typeof loginUserType>) {
        try {
            setIsSending(true);
            const res = await axios.post(
                "http://localhost:3000/api/signin",
                values
            );
            console.log(res);
            if (res.status != 200) {
                toast({
                    title: "Issue signing in",
                    // @ts-ignore
                    description: `${res.data.message}`,
                });
                return;
            }
            toast({
                title: "Signin successful",
            });
            console.log(res.data)
            setUser({
                // @ts-ignore
                accessToken: res.data?.data?.accessToken as string,
                // @ts-ignore
                refreshToken: res.data?.data?.refreshToken as string,
                // @ts-ignore
                username: res.data?.data?.username as string,
                // @ts-ignore
                id: res.data?.data?.userid as string
            });
            navigate("/");
        } catch (err: any) {
            toast({
                title: "Issue signing in",
                description: `There was an error signing in ${err.message}`,
                variant: "destructive"
            });
        } finally {
            setIsSending(false);
        }
    }
    const { setUser } = useContext(UserContext)

    return (
        <div className="flex items-center justify-center h-screen">
            <div className="md:border-2 p-4">
                <h1 className="font-bold text-2xl pb-4 text-center">Sign-in to use Gather Town</h1>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-8"
                    >
                        <div className="w-60 md:w-96">
                            <FormField
                                control={form.control}
                                name="username"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Username</FormLabel>
                                        <FormControl>
                                            <Input
                                                className="h-12 md:text-xl"
                                                placeholder="username"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="w-60 md:w-96">
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Password</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="password"
                                                placeholder="password"
                                                {...field}
                                                className="h-12 md:text-xl"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        {!isSending && <Button type="submit">Login</Button>}
                    </form>
                </Form>
                <p className="pt-4">Don't have an account? <p className="text-blue-500 cursor-pointer" onClick={() => { navigate("/signup") }}>Signup</p></p>
            </div>
        </div>
    );
};
