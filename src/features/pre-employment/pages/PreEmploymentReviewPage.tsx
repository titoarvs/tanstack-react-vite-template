import { Link, useNavigate, useParams } from "@tanstack/react-router"
import { zodResolver } from "@hookform/resolvers/zod"
import { ChevronLeft, Loader2 } from "lucide-react"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { PageContent } from "@/components/layout/PageContent"
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
import { ManagerDetailsFields } from "@/features/employees/components/employment/ManagerDetailsFields"
import { ProbationDatesDisplay } from "@/features/employees/components/employment/ProbationDatesDisplay"
import {
  DEPARTMENTS,
  EMPLOYMENT_TYPES,
  getJobTitlesForDepartment,
  getPositionsForDepartment,
  WORK_LOCATIONS,
} from "@/features/employees/data/masterData"
import { formatAddress } from "@/features/employees/lib/address"
import { getCreateFormStatusDetailOptions } from "@/features/employees/lib/employmentStatus"
import { prefillEmploymentFromManatal } from "@/features/integrations/manatal/manatalPrefill"
import {
  useApprovePreEmploymentInvite,
  usePreEmploymentInvite,
  useRejectPreEmploymentInvite,
  useSuggestEmployeeIdForApproval,
} from "../hooks/usePreEmployment"
import {
  approveEmploymentSchema,
  type ApproveEmploymentFormData,
} from "../schemas/preEmploymentSchema"
import type { PreEmploymentFormData } from "../types"
import { getPreEmploymentFullName } from "../types"
import { InviteSummary } from "../components/InviteSummary"

const departmentOptions = DEPARTMENTS.map(d => ({ value: d, label: d }))
const employmentTypeOptions = EMPLOYMENT_TYPES.map(t => ({
  value: t.value,
  label: t.label,
}))
const workLocationOptions = WORK_LOCATIONS.map(w => ({
  value: w.value,
  label: w.label,
}))
const statusDetailOptions = getCreateFormStatusDetailOptions()
const isManagerOptions = [
  { value: "false", label: "No" },
  { value: "true", label: "Yes" },
]

function CandidateSubmissionSummary({ payload }: { payload: Partial<PreEmploymentFormData> }) {
  const rows = [
    ["Phone", payload.phone],
    ["Address", formatAddress(payload.address)],
    ["Emergency", payload.emergencyContactName],
    ["Preferred name", payload.preferredName],
    [
      "Policies",
      payload.acknowledgeHandbook && payload.acknowledgePrivacy ? "Acknowledged" : "—",
    ],
  ]

  return (
    <Card className="border-border/80">
      <CardHeader>
        <CardTitle className="text-base">Candidate submission</CardTitle>
      </CardHeader>
      <CardContent>
        <dl className="grid gap-3 sm:grid-cols-2">
          {rows.map(([label, value]) => (
            <div key={String(label)}>
              <dt className="text-xs font-semibold uppercase text-muted-foreground">{label}</dt>
              <dd className="mt-0.5 text-sm font-medium text-foreground">{value || "—"}</dd>
            </div>
          ))}
        </dl>
      </CardContent>
    </Card>
  )
}

export function PreEmploymentReviewPage() {
  const { inviteId } = useParams({ strict: false }) as { inviteId: string }
  const navigate = useNavigate()
  const { data: invite, isLoading, isError } = usePreEmploymentInvite(inviteId ?? "")
  const { data: suggestedId } = useSuggestEmployeeIdForApproval()
  const approve = useApprovePreEmploymentInvite()
  const reject = useRejectPreEmploymentInvite()
  const [credentials, setCredentials] = useState<{
    loginEmail: string
    tempPasswordHint: string
    employeeId: string
  } | null>(null)
  const [rejectNote, setRejectNote] = useState("")

  const today = new Date().toISOString().slice(0, 10)

  const form = useForm<ApproveEmploymentFormData>({
    resolver: zodResolver(approveEmploymentSchema),
    defaultValues: {
      employeeId: "",
      department: "Engineering",
      position: "",
      jobTitle: "",
      isManager: false,
      managerId: "",
      employmentType: "full_time",
      statusDetail: "probationary",
      hireDate: today,
      contractSignedDate: today,
      workLocation: "onsite",
    },
  })

  const department = form.watch("department")
  const positionOptions = getPositionsForDepartment(department).map(p => ({
    value: p,
    label: p,
  }))
  const jobTitleOptions = getJobTitlesForDepartment(department).map(t => ({
    value: t,
    label: t,
  }))

  useEffect(() => {
    if (!invite) return
    const manatal = prefillEmploymentFromManatal({
      intendedDepartment: invite.intendedDepartment,
      intendedPosition: invite.intendedPosition,
      intendedHireDate: invite.intendedHireDate,
      inviteId: invite.id,
    })
    const hireDate = invite.intendedHireDate ?? manatal.hireDate ?? today
    form.reset({
      employeeId: suggestedId ?? "",
      department:
        (invite.intendedDepartment as ApproveEmploymentFormData["department"]) ??
        manatal.department ??
        "Engineering",
      position: invite.intendedPosition ?? manatal.position ?? positionOptions[0]?.value ?? "",
      jobTitle: manatal.jobTitle ?? jobTitleOptions[0]?.value ?? "",
      isManager: manatal.isManager ?? false,
      managerId: "",
      employmentType: manatal.employmentType ?? "full_time",
      statusDetail: manatal.statusDetail ?? "probationary",
      hireDate,
      contractSignedDate: manatal.contractSignedDate ?? hireDate,
      workLocation: manatal.workLocation ?? "onsite",
    })
  }, [invite, suggestedId, form, positionOptions, jobTitleOptions, today])

  const onApprove = form.handleSubmit(async data => {
    const result = await approve.mutateAsync({ id: inviteId, employment: data })
    setCredentials({
      loginEmail: result.loginEmail,
      tempPasswordHint: result.tempPasswordHint,
      employeeId: result.employeeId,
    })
  })

  const onReject = async () => {
    await reject.mutateAsync({ id: inviteId, note: rejectNote })
    navigate({ to: "/employees/pre-employment" })
  }

  if (isLoading) {
    return (
      <PageContent>
        <p className="text-sm text-muted-foreground">Loading review…</p>
      </PageContent>
    )
  }

  if (isError || !invite) {
    return (
      <PageContent>
        <p className="text-destructive">Invite not found.</p>
        <Link to="/employees/pre-employment" className="mt-4 inline-block text-primary">
          Back to queue
        </Link>
      </PageContent>
    )
  }

  if (invite.status !== "submitted" && !credentials) {
    return (
      <PageContent>
        <p className="text-muted-foreground">This invite is not awaiting review.</p>
        <Link to="/employees/pre-employment" className="mt-4 inline-block text-primary">
          Back to queue
        </Link>
      </PageContent>
    )
  }

  if (credentials) {
    return (
      <PageContent className="bg-container">
        <div className="mx-auto max-w-lg space-y-4">
          <Card className="border-success/30 bg-success/5">
            <CardHeader>
              <CardTitle className="text-base">Approved — portal provisioned</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <p>
                <span className="text-muted-foreground">Employee ID:</span>{" "}
                <strong>{credentials.employeeId}</strong>
              </p>
              <p>
                <span className="text-muted-foreground">Login email:</span>{" "}
                <strong>{credentials.loginEmail}</strong>
              </p>
              <p className="text-muted-foreground">{credentials.tempPasswordHint}</p>
              <Button asChild className="mt-2">
                <Link to="/employees/pre-employment">Back to queue</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </PageContent>
    )
  }

  return (
    <PageContent className="bg-container">
      <div className="mx-auto max-w-4xl space-y-6">
        <Link
          to="/employees/pre-employment"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ChevronLeft className="h-4 w-4" />
          Pre-employment queue
        </Link>

        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Review {getPreEmploymentFullName(invite)}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Confirm employment details and approve to create the employee record and portal login.
          </p>
        </div>

        <InviteSummary invite={invite} />
        <CandidateSubmissionSummary payload={invite.candidatePayload} />

        <Card className="border-border/80">
          <CardHeader>
            <CardTitle className="text-base">Employment confirmation</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={onApprove} className="grid gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="employeeId"
                  render={({ field }) => (
                    <FormItem className="sm:col-span-2">
                      <FormLabel required>Employee ID</FormLabel>
                      <FormControl>
                        <Input {...field} readOnly className="bg-muted/40" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormSelectField
                  name="department"
                  label="Department"
                  options={departmentOptions}
                  required
                />
                <FormSelectField
                  name="position"
                  label="Position"
                  options={positionOptions}
                  required
                />
                <FormSelectField
                  name="jobTitle"
                  label="Job title"
                  options={jobTitleOptions}
                  required
                />
                <FormField
                  control={form.control}
                  name="isManager"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Is manager?</FormLabel>
                      <FormControl>
                        <select
                          className="flex h-10 w-full rounded-md border border-input bg-card px-3 py-2 text-sm"
                          value={field.value ? "true" : "false"}
                          onChange={e => field.onChange(e.target.value === "true")}
                        >
                          {isManagerOptions.map(o => (
                            <option key={o.value} value={o.value}>
                              {o.label}
                            </option>
                          ))}
                        </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="sm:col-span-2">
                  <ManagerDetailsFields />
                </div>
                <FormSelectField
                  name="workLocation"
                  label="Work location"
                  options={workLocationOptions}
                  required
                />
                <FormSelectField
                  name="employmentType"
                  label="Employment type"
                  options={employmentTypeOptions}
                  required
                />
                <FormSelectField
                  name="statusDetail"
                  label="Active status"
                  options={statusDetailOptions}
                  required
                />
                <FormField
                  control={form.control}
                  name="hireDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel required>Hire date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <ProbationDatesDisplay />
                <FormField
                  control={form.control}
                  name="contractSignedDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel required>Date contract signed</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex flex-wrap gap-2 sm:col-span-2">
                  <Button type="submit" disabled={approve.isPending}>
                    {approve.isPending ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Approving…
                      </>
                    ) : (
                      "Approve & create employee"
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>

        <Card className="border-destructive/30">
          <CardHeader>
            <CardTitle className="text-base">Request changes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Input
              value={rejectNote}
              onChange={e => setRejectNote(e.target.value)}
              placeholder="Optional note to the candidate"
            />
            <Button
              type="button"
              variant="outline"
              disabled={reject.isPending}
              onClick={onReject}
            >
              Send back to candidate
            </Button>
          </CardContent>
        </Card>
      </div>
    </PageContent>
  )
}
