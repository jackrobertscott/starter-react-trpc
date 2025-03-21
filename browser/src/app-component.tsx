import {logout} from "@browser/utils-auth"
import {useTRPC} from "@browser/utils-trpc-context"
import {useMutation, useQuery} from "@tanstack/react-query"
import {
  Bell,
  CheckSquare,
  FileOutput,
  LineChart,
  LogOut,
  RefreshCw,
  Settings,
  Trash,
  UserPlus,
  Users,
} from "lucide-react"
import {useRef} from "react"
import {useNavigate} from "react-router-dom"
import {Button} from "./components/button-component"
import {DashboardCard} from "./components/dashboard-card-component"
import {Dropdown} from "./components/dropdown-component"
import {StatsCard} from "./components/stats-card-component"
import {TodoList} from "./components/todo-list-component"
import {UserList} from "./components/user-list-component"

export function App() {
  const trpc = useTRPC()
  const navigate = useNavigate()
  const listUsers = useQuery(trpc.userList.queryOptions())
  const headerRef = useRef<HTMLDivElement>(null)

  // Get the first user ID for demo purposes
  const currentUserId = listUsers.data?.[0]?.id || ""

  // Todo queries and mutations
  const listTodos = useQuery({
    ...trpc.todosByUserId.queryOptions({
      userId: currentUserId,
    }),
    enabled: !!currentUserId,
  })

  const {mutate: createTodo} = useMutation(trpc.todoCreate.mutationOptions())

  const {mutate: updateTodo} = useMutation(trpc.todoUpdate.mutationOptions())

  const {mutate: deleteTodo} = useMutation(trpc.todoDelete.mutationOptions())

  const userCount = listUsers.data?.length || 0
  const isLoading = listUsers.isLoading
  const todoCount = listTodos.data?.length || 0
  const completedTodoCount =
    listTodos.data?.filter((todo) => todo.completed).length || 0

  const handleLogout = () => {
    logout()
    navigate("/")
  }

  const handleUserSelect = (userId: string) => {
    console.log(`User selected: ${userId}`)
    // Handle user selection
  }

  const handleAddTodo = (title: string, userId: string) => {
    createTodo(
      {title, userId},
      {
        onSuccess: () => {
          listTodos.refetch()
        },
      }
    )
  }

  const handleToggleTodo = (id: string, completed: boolean) => {
    updateTodo(
      {id, completed},
      {
        onSuccess: () => {
          listTodos.refetch()
        },
      }
    )
  }

  const handleDeleteTodo = (id: string) => {
    deleteTodo(
      {id},
      {
        onSuccess: () => {
          listTodos.refetch()
        },
      }
    )
  }

  // Display a loading state if the data is being fetched
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-t-indigo-600 border-r-transparent border-b-indigo-600 border-l-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-lg font-semibold text-gray-700">
            Loading dashboard...
          </h2>
          <p className="text-gray-500 mt-1">
            Please wait while we prepare your dashboard
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div ref={headerRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14">
            <h1 className="text-lg font-semibold text-gray-900">Dashboard</h1>

            <div className="flex items-center space-x-2">
              <Button variant="icon" icon={Bell} />
              <Button variant="icon" icon={Settings} />
              <Button variant="icon" icon={LogOut} onClick={handleLogout}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
        {/* Stats row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
          <StatsCard
            title="Total Users"
            value={userCount}
            icon={Users}
            accentColor="bg-indigo-600"
            trend={{value: 12, label: "vs last month"}}
          />

          <StatsCard
            title="Active Users"
            value={Math.round(userCount * 0.8)}
            icon={UserPlus}
            accentColor="bg-blue-600"
            trend={{value: 8, label: "vs last month"}}
          />

          <StatsCard
            title="Weekly Growth"
            value={`${userCount > 0 ? "5.2" : "0"}%`}
            icon={LineChart}
            accentColor="bg-green-600"
            trend={{value: 2.1, label: "vs last week"}}
          />
        </div>

        {/* Main content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
          {/* User list card */}
          <DashboardCard
            title="Recent Users"
            icon={Users}
            accentColor="bg-indigo-600"
            action={
              <Dropdown
                label="Actions"
                buttonClassName="text-xs py-1 px-2"
                items={[
                  {
                    label: "Refresh",
                    onClick: () => listUsers.refetch(),
                    icon: RefreshCw,
                  },
                  {
                    label: "Export",
                    onClick: () => console.log("Export clicked"),
                    icon: FileOutput,
                  },
                  {
                    label: "Delete",
                    onClick: () => console.log("Delete clicked"),
                    icon: Trash,
                    disabled: true,
                  },
                ]}
              />
            }>
            <UserList
              users={listUsers.data || []}
              isLoading={listUsers.isLoading}
              onUserSelect={handleUserSelect}
            />

            <div className="mt-3 flex justify-end px-3 pb-1">
              <Button variant="outline" size="sm">
                View all users
              </Button>
            </div>
          </DashboardCard>

          {/* Todo list card */}
          <DashboardCard
            title="My Todos"
            icon={CheckSquare}
            accentColor="bg-green-600"
            action={
              <Dropdown
                label="Actions"
                buttonClassName="text-xs py-1 px-2"
                items={[
                  {
                    label: "Refresh",
                    onClick: () => listTodos.refetch(),
                    icon: RefreshCw,
                  },
                ]}
              />
            }>
            <div className="mb-2 flex justify-between items-center px-1">
              <div className="text-sm text-gray-500">
                {completedTodoCount} of {todoCount} completed
              </div>
              <div className="text-sm font-medium">
                {todoCount > 0
                  ? Math.round((completedTodoCount / todoCount) * 100)
                  : 0}
                % complete
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5 mb-4">
              <div
                className="bg-green-600 h-1.5 rounded-full"
                style={{
                  width: `${
                    todoCount > 0 ? (completedTodoCount / todoCount) * 100 : 0
                  }%`,
                }}></div>
            </div>
            <TodoList
              todos={listTodos.data || []}
              isLoading={listTodos.isLoading || !currentUserId}
              userId={currentUserId}
              onAddTodo={handleAddTodo}
              onToggleTodo={handleToggleTodo}
              onDeleteTodo={handleDeleteTodo}
            />
          </DashboardCard>
        </div>
      </main>
    </div>
  )
}
