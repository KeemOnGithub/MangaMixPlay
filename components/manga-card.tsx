import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

type MangaCardProps = {
  title: string;
  description: string;
  author: string;
  image: string;
};

export function MangaCard({title, description, author, image}: MangaCardProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-1 flex-row gap-4">
                <CardDescription>{description}</CardDescription>
                {/* <CardAction></CardAction> */}
                <img 
                    src={image}
                    alt={title}
                    width="100px"
                    height="200px"
                />
            </CardContent>
            <CardFooter>
                {author}
            </CardFooter>
        </Card>
    )
}