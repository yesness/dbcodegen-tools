import path from 'path';
import fse from 'fs-extra';

const EXAMPLE_DIR = path.resolve(__dirname, '../example');

class Main {
    private static cmdPrefix = 'npx dbcodegen-tools';

    static async main() {
        const [cmd, ...args] = process.argv.slice(2);
        switch (cmd) {
            case 'init':
                await this.init(args);
                return;
        }
        console.log(`Usage: ${this.cmdPrefix} (build|init)`);
    }

    private static async init(args: string[]) {
        if (args.length !== 1) {
            console.log(`Usage: ${this.cmdPrefix} init [path/to/output/dir]`);
            return;
        }
        const outDir = path.resolve(process.cwd(), args[0]);
        await fse.copy(EXAMPLE_DIR, outDir);
    }
}

Main.main().catch((e) => console.error(e));
