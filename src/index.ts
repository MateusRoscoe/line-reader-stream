import fs from 'fs'
import { Readable } from 'stream'
import { getLogger } from '@log4js-node/log4js-api'

const log = getLogger('LineReaderStream')

class LineReader extends Readable {
    private filePath: string

    private buffer: string

    private options: any // TODO! Type this properly

    private readStream: fs.ReadStream | null = null

    private constructor(filePath: string, options: any = {}) {
        super(options)
        this.filePath = filePath
        this.options = options
        this.buffer = ''

        if (!fs.existsSync(filePath)) {
            throw new Error(`File not found: ${filePath}`)
        }
    }

    public static createReadStream(filePath: string, options: any = {}) {
        log.trace('Creating read stream:', filePath, options)
        return new LineReader(filePath, options)
    }

    _read() {
        if (!this.readStream) {
            this.readStream = fs.createReadStream(this.filePath, this.options)
            this.readStream.on('data', this.handleData.bind(this))
            this.readStream.on('end', () => {
                log.debug('End of file:', this.filePath)
                this.readStream?.close()

                if (this.buffer.length > 0) {
                    this.push(this.buffer)
                }
                this.push(null)
            }) // Signal end of stream
            this.readStream.on('error', err => {
                log.error('Error reading file:', err)
                this.destroy(err)
            })
        }
    }

    private handleData(chunk: Buffer) {
        this.buffer += chunk.toString()
        const lines = this.buffer.split(/(?:\n|\r\n|\r)/g)
        this.buffer = lines.pop() || ''

        for (const line of lines) {
            this.push(line)
        }
    }
}

export default LineReader
