import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

export function WelcomeCard() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Welcome to MangaMixPlay!</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-1 flex-row gap-4">
                <CardDescription style={{ whiteSpace: "pre-line" }}>{"Using the MangaDex API, this website allows you to read manga of your choice if it is available.\nJust type its name in the search bar above. Happy reading!"}</CardDescription>
                {/* <CardAction></CardAction> */}
            </CardContent>
            <CardFooter>
                By KeemOnGithub
            </CardFooter>
        </Card>
    )
}