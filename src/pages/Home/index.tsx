import { HandPalm, Play } from "phosphor-react";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod'
import * as zod from "zod";

import { CountdownContainer, FormContainer, HomeContainer, MinutesAmountInput, Separator, StartCountdownButton, StopCountdownButton, TaskInput } from "./styles";
import { useEffect, useState } from "react";
import { differenceInSeconds } from 'date-fns'

const newCycleFormValidationSchema = zod.object({
    task: zod.string().min(1, "Informe a tarefa."),
    minutesAmount: zod.number().min(5).max(60),
});

type NewCycleFormData = zod.infer<typeof newCycleFormValidationSchema>

interface Cycle {
    id: string
    task: string
    minutesAmount: number
    startDate: Date
    interruptedDate?: Date
}

export function Home() {

    const [cycles, setCycles] = useState<Cycle[]>([])
    const [activeCycleId, setActiveCycleId] = useState<string | null>(null)
    const [amountSecondsPassed, setAmountSecondsPassed] = useState(0)

    const activeCycle = cycles.find(cycle => cycle.id === activeCycleId)

    useEffect(() => {
        let interval: number;

        if (activeCycle) {
            interval = setInterval(() => {
                setAmountSecondsPassed(
                    differenceInSeconds(new Date(), activeCycle.startDate),
                )
            }, 1000)
        }

        return () => {
            clearInterval(interval)
        }

    }, [activeCycle])

    const { register, handleSubmit, watch, reset } = useForm<NewCycleFormData>({
        resolver: zodResolver(newCycleFormValidationSchema),
        defaultValues: {
            task: "",
            minutesAmount: 0,
        }
    })

    const totalSeconds = activeCycle ? activeCycle.minutesAmount * 60 : 0
    const currentSeconds = activeCycle ? totalSeconds - amountSecondsPassed : 0

    const minutesAmount = Math.floor(currentSeconds / 60 )
    const secondsAmount = currentSeconds % 60

    const minutes = String(minutesAmount).padStart(2, "0")
    const seconds = String(secondsAmount).padStart(2, "0")

    useEffect(() => {
        if (activeCycle) {
            document.title = `${minutes}:${seconds}`
        }
    }, [minutes, seconds, activeCycle])

    const task = watch("task");
    const isSubmitDisabled = !task

    console.log(cycles)
    
    function handleCreateNewCycle(data: NewCycleFormData) {
        const id = String(new Date().getTime());

        const newCycle: Cycle = {
            id: id,
            task: data.task,
            minutesAmount: data.minutesAmount,
            startDate: new Date(),
        }

        setCycles(state => [...state, newCycle])
        setActiveCycleId(id)
        setAmountSecondsPassed(0)

        reset();
    }

    function handleInterruptCycle() {
        setCycles(
            cycles.map(cycle => {
            if (cycle.id === activeCycleId) {
                return {...cycle, interruptedDate: new Date()}
            } else {
                return cycle
            }
        })
        )
        setActiveCycleId(null)
    }

    return (
        <HomeContainer>
            <form onSubmit={handleSubmit(handleCreateNewCycle)} action="">
                <FormContainer>
                    <label htmlFor="task">Vou trabalhar em</label>
                    <TaskInput
                        id="task"
                        list="task-suggestions"
                        placeholder="Dê um nome para o seu projeto"
                        disabled={!!activeCycle}
                        {...register("task")}
                    />

                    <datalist id="task-suggestions">
                        <option value="Projeto 1"/>
                        <option value="Projeto 2"/>
                        <option value="Projeto 3"/>
                        <option value="Projeto 4"/>
                        <option value="Banana"/>
                    </datalist>

                    <label htmlFor="minutesAmount">durante</label>
                    <MinutesAmountInput
                        id="minutesAmount"
                        type="number"
                        placeholder="00"
                        step={5}
                        min={5}
                        max={60}
                        disabled={!!activeCycle}
                        {...register("minutesAmount", {valueAsNumber: true})}
                    />

                    <span>minutos.</span>
                </FormContainer>

                <CountdownContainer>
                    <span>{minutes[0]}</span>
                    <span>{minutes[1]}</span>
                    <Separator>:</Separator>
                    <span>{seconds[0]}</span>
                    <span>{seconds[1]}</span>
                </CountdownContainer>

                { activeCycle ? (
                <StopCountdownButton onClick={handleInterruptCycle} type="button">
                    <HandPalm size={24}/>
                    Interromper
                </StopCountdownButton>
                ) : 
                <StartCountdownButton disabled={isSubmitDisabled} type="submit">
                    <Play size={24}/>
                    Começar
                </StartCountdownButton>
            }

            </form>
        </HomeContainer>
    )
}