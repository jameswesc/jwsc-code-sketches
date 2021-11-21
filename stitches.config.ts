import { blackA, whiteA } from '@radix-ui/colors'
import { createStitches } from '@stitches/react'
import type * as Stitches from '@stitches/react'

export const { styled, globalCss, getCssText } = createStitches({
    theme: {
        colors: {
            ...blackA,
            ...whiteA,

            bg: '$whiteA5',
            bgHover: '$whiteA8',
            bgFocus: '$whiteA9',

            line: '$whiteA9',
            lineHover: '$whiteA10',
            lineFocus: '$whiteA11',
        },
        space: {
            1: '5px',
            2: '10px',
            3: '15px',
            4: '20px',
        },
        fonts: {
            supply: `'Supply', monospace`,
            objectSans: `'Object Sans', sans-serif`,
            inter: `Inter var, Inter, sans-serif`,
        },
    },
    utils: {
        bg(value: Stitches.PropertyValue<'backgroundColor'>) {
            return {
                backgroundColor: value,
            }
        },
        p(value: Stitches.PropertyValue<'padding'>) {
            return {
                paddingTop: value,
                paddingBottom: value,
                paddingLeft: value,
                paddingRight: value,
            }
        },
        pt(value: Stitches.PropertyValue<'padding'>) {
            return {
                paddingTop: value,
            }
        },
        pb(value: Stitches.PropertyValue<'padding'>) {
            return {
                paddingBottom: value,
            }
        },
        pl(value: Stitches.PropertyValue<'padding'>) {
            return {
                paddingLeft: value,
            }
        },
        pr(value: Stitches.PropertyValue<'padding'>) {
            return {
                paddingRight: value,
            }
        },
        py(value: Stitches.PropertyValue<'padding'>) {
            return {
                paddingTop: value,
                paddingBottom: value,
            }
        },
        px(value: Stitches.PropertyValue<'padding'>) {
            return {
                paddingLeft: value,
                paddingRight: value,
            }
        },
        m(value: Stitches.PropertyValue<'margin'>) {
            return {
                marginTop: value,
                marginBottom: value,
                marginLeft: value,
                marginRight: value,
            }
        },
        mt(value: Stitches.PropertyValue<'margin'>) {
            return {
                marginTop: value,
            }
        },
        mb(value: Stitches.PropertyValue<'margin'>) {
            return {
                marginBottom: value,
            }
        },
        ml(value: Stitches.PropertyValue<'margin'>) {
            return {
                marginLeft: value,
            }
        },
        mr(value: Stitches.PropertyValue<'margin'>) {
            return {
                marginRight: value,
            }
        },
        my(value: Stitches.PropertyValue<'margin'>) {
            return {
                marginTop: value,
                marginBottom: value,
            }
        },
        mx(value: Stitches.PropertyValue<'margin'>) {
            return {
                marginLeft: value,
                marginRight: value,
            }
        },
    },
})
