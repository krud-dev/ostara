package dev.krud.boost.daemon.okhttp

import okhttp3.MediaType
import okhttp3.ResponseBody
import okio.BufferedSource
import okio.ForwardingSource
import okio.Source
import okio.buffer

typealias ProgressListener = (bytesRead: Long, contentLength: Long, done: Boolean) -> Unit

class ProgressResponseBody(private val realResponseBody: ResponseBody, private val listener: ProgressListener) : ResponseBody() {
    private var bufferedSource: BufferedSource? = null

    override fun contentLength(): Long = realResponseBody.contentLength()

    override fun contentType(): MediaType? = realResponseBody.contentType()

    override fun source(): BufferedSource {
        if (bufferedSource == null) {
            bufferedSource = getSource(realResponseBody.source()).buffer()
        }
        return bufferedSource!!
    }

    private fun getSource(source: Source): Source {
        return object : ForwardingSource(source) {
            var totalBytesRead = 0L
            override fun read(sink: okio.Buffer, byteCount: Long): Long {
                val bytesRead = super.read(sink, byteCount)
                totalBytesRead += if (bytesRead != -1L) bytesRead else 0
                listener(totalBytesRead, realResponseBody.contentLength(), bytesRead == -1L)
                return bytesRead
            }
        }
    }
}