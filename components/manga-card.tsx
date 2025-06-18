import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import Link from "next/link";

type MangaCardProps = {
  title: string;
  description: string;
  author: string;
  image: string;
  id: string;
};

export function MangaCard({title, description, author, image, id}: MangaCardProps) {
    return (
        <Card>
            <CardHeader>
                <Link href={{pathname: "/read", query: { id: id }}}>
                    <CardTitle>{title}</CardTitle>
                </Link>
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