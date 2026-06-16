import { zodResolver } from "@hookform/resolvers/zod"
import { Copy, Link2, Loader2, UserPlus } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { FormSelectField } from "@/components/ui/form-select-field"
import { Input } from "@/components/ui/input"
import { DEPARTMENTS, EMPLOYMENT_TYPES, WORK_LOCATIONS } from "@/features/employees/data/masterData"
import { buildJoinUrl } from "../api/preEmploymentApi"
import { useCreatePreEmploymentInvite } from "../hooks/usePreEmployment"
import {
  createInviteSchema,
  type CreateInviteFormData,
} from "../schemas/preEmploymentSchema"
import type { CreatePreEmploymentInviteInput } from "../types"

const departmentOptions = DEPARTMENTS.map(d => ({ value: d, label: d }))
const employmentTypeOptions = EMPLOYMENT_TYPES.map(t => ({
  value: t.value,
  label: t.label,
}))
const workLocationOptions = WORK_LOCATIONS.map(w => ({
  value: w.value,
  label: w.label,
}))

export function CreateInviteForm() {
  const [joinUrl, setJoinUrl] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const createInvite = useCreatePreEmploymentInvite()

  const form = useForm<CreateInviteFormData>({
    resolver: zodResolver(createInviteSchema),
    defaultValues: {
      email: "",
      firstName: "",
      lastName: "",
      intendedDepartment: "Engineering",
      intendedPosition: "",
      intendedHireDate: "",
      intendedEmploymentType: "full_time",
      intendedWorkLocation: "onsite",
      isAcademicInternship: false,
    },
  })

  const employmentType = form.watch("intendedEmploymentType")

  const onSubmit = form.handleSubmit(async data => {
    const invite = await createInvite.mutateAsync({
      ...data,
      intendedEmploymentType: data.intendedEmploymentType as CreatePreEmploymentInviteInput["intendedEmploymentType"],
      intendedWorkLocation: data.intendedWorkLocation as CreatePreEmploymentInviteInput["intendedWorkLocation"],
    })
    setJoinUrl(buildJoinUrl(invite.token))
  })

  const handleCopy = async () => {
    if (!joinUrl) return
    await navigator.clipboard.writeText(joinUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (joinUrl) {
    return (
      <Card className="border-success/30 bg-success/5">
        <CardHeader>
          <CardTitle className="text-base">Invite link ready</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Share this link with the candidate. Demo:{" "}
            <code className="rounded bg-muted px-1 text-xs">/join/demo-token</code>
          </p>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <div className="flex min-w-0 flex-1 items-center gap-2 rounded-lg border border-border bg-card p-3">
              <Link2 className="h-4 w-4 shrink-0 text-muted-foreground" />
              <span className="truncate text-sm">{joinUrl}</span>
            </div>
            <Button type="button" variant="outline" onClick={handleCopy}>
              <Copy className="h-4 w-4" />
              {copied ? "Copied" : "Copy link"}
            </Button>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => {
              setJoinUrl(null)
              form.reset()
            }}
          >
            Send another invite
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-border/80">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <UserPlus className="h-4 w-4" />
          Send pre-employment invite
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={onSubmit} className="grid gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="sm:col-span-2">
                  <FormLabel required>Work email</FormLabel>
                  <FormControl>
                    <Input {...field} type="email" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>First name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Last name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormSelectField
              name="intendedDepartment"
              label="Intended department"
              options={departmentOptions}
            />
            <FormField
              control={form.control}
              name="intendedPosition"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Intended position</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Optional" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="intendedHireDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Intended hire date</FormLabel>
                  <FormControl>
                    <Input {...field} type="date" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormSelectField
              name="intendedEmploymentType"
              label="Employment type"
              options={employmentTypeOptions}
              required
            />
            <FormSelectField
              name="intendedWorkLocation"
              label="Work location"
              options={workLocationOptions}
              required
            />
            {employmentType === "intern" && (
              <FormField
                control={form.control}
                name="isAcademicInternship"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start gap-3 sm:col-span-2">
                    <FormControl>
                      <input
                        type="checkbox"
                        className="mt-1 h-4 w-4 rounded border-input"
                        checked={field.value ?? false}
                        onChange={e => field.onChange(e.target.checked)}
                      />
                    </FormControl>
                    <div>
                      <FormLabel>Academic internship (requires MOA)</FormLabel>
                      <p className="text-xs text-muted-foreground">
                        Check if this internship is part of an academic program.
                      </p>
                    </div>
                  </FormItem>
                )}
              />
            )}
            <div className="sm:col-span-2">
              <Button type="submit" disabled={createInvite.isPending}>
                {createInvite.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Creating…
                  </>
                ) : (
                  "Create invite link"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
