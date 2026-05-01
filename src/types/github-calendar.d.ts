declare module "github-calendar" {
    interface GitHubCalendarOptions {
        responsive?: boolean;
        tooltips?: boolean;
        global_stats?: boolean;
        cache?: number;
        proxy?: string;
        summary_text?: string;
    }

    function GitHubCalendar(
        container: string | HTMLElement,
        username: string,
        options?: GitHubCalendarOptions
    ): Promise<void>;

    export default GitHubCalendar;
}
